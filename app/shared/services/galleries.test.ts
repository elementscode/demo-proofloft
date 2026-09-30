import { equal, errorf, test, assert, sql } from "@elements/app";
import { comments, favorites, isPhotographerOf, listPhotos, ownGalleryOrThrow } from "#app/shared/services/galleries";
import { SEED_PHOTOS } from "#app/shared/services/seed-photos";
import { makeGallery, signInAs } from "#app/shared/services/test-fixtures";

test("galleries service", () => {
  test("listPhotos serves seeded photos from assets and uploads by hash", () => {
    let f = makeGallery();
    sql(`
      insert into photos (galleryId, name, position, data, contentType, size)
           values (${f.galleryId}, 'UPLOAD.jpg', 9, ${Buffer.from([255, 216, 255])}, 'image/jpeg', 3)
    `);

    let photos = listPhotos(f.galleryId);
    equal(photos.length, 4);
    equal(photos[0].url, SEED_PHOTOS["wedding-01"]);
    assert(/^\/photos\/[0-9a-f-]+\/[0-9a-f]{64}$/.test(photos[3].url), `upload url was ${photos[3].url}`);
  });

  test("a client can heart a photo through the gallery's view", () => {
    let f = makeGallery();
    favorites.view({ galleryId: f.galleryId }).insert({ photoId: f.photoIds[0] });

    let n = sql<{ n: number }>(`select count(*)::int as n from favorites where galleryId = ${f.galleryId}`).firstOrThrow().n;
    equal(n, 1);
  });

  test("a heart for another gallery's photo is refused", () => {
    let a = makeGallery();
    let b = makeGallery({ email: "other@example.com" });

    try {
      favorites.view({ galleryId: a.galleryId }).insert({ photoId: b.photoIds[0] });
      errorf("expected the insert to be refused");
    } catch (err: any) {
      assert(/not in this gallery/.test(err.message), err.message);
    }
  });

  test("a final gallery refuses new hearts", () => {
    let f = makeGallery({ status: "final" });

    try {
      favorites.view({ galleryId: f.galleryId }).insert({ photoId: f.photoIds[0] });
      errorf("expected the insert to be refused");
    } catch (err: any) {
      assert(/final/.test(err.message), err.message);
    }
  });

  test("comments are attributed by who is signed in, not by what the browser sent", () => {
    let f = makeGallery();
    let view = comments.view({ galleryId: f.galleryId });

    view.insert({ photoId: f.photoIds[0], body: "  warmer please  ", author: "photographer" });

    signInAs(f.userId);
    view.insert({ photoId: f.photoIds[0], body: "on it", author: "client" });

    let rows = sql<{ author: string; body: string }>(`
      select author, body from comments where galleryId = ${f.galleryId} order by createdAt, id
    `).all();

    equal(rows, [
      { author: "client", body: "warmer please" },
      { author: "photographer", body: "on it" },
    ]);
  });

  test("a photographer cannot open another photographer's gallery", () => {
    let mine = makeGallery();
    let theirs = makeGallery({ email: "other@example.com" });
    signInAs(mine.userId);

    assert(isPhotographerOf(mine.galleryId));
    assert(!isPhotographerOf(theirs.galleryId));

    try {
      ownGalleryOrThrow(theirs.galleryId);
      errorf("expected a not found error");
    } catch (err: any) {
      equal(err.statusCode, 404);
    }
  });
});
