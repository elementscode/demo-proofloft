import { equal, sql, test } from "@elements/app";
import { SEED_PHOTOS } from "#app/shared/services/seed-photos";
import { makeGallery } from "#app/shared/services/test-fixtures";
import { gallerySummaries } from "./template";

test("admin galleries", () => {
  test("summaries count photos, hearts and comments per gallery", () => {
    let f = makeGallery();
    sql(`insert into favorites (galleryId, photoId) values (${f.galleryId}, ${f.photoIds[0]}), (${f.galleryId}, ${f.photoIds[2]})`);
    sql(`insert into comments (galleryId, photoId, author, body) values (${f.galleryId}, ${f.photoIds[0]}, 'client', 'love it')`);

    let [g] = gallerySummaries(f.userId);

    equal([g.photoCount, g.favoriteCount, g.commentCount], [3, 2, 1]);
    equal(g.covers, [SEED_PHOTOS["wedding-01"], SEED_PHOTOS["wedding-02"], SEED_PHOTOS["wedding-03"]]);
  });

  test("a photographer sees only their own galleries", () => {
    makeGallery();
    let other = makeGallery({ email: "other@example.com" });

    equal(gallerySummaries(other.userId).length, 1);
  });
});
