import { assert, equal, errorf, sql, test } from "@elements/app";
import { makeGallery, signInAs } from "#app/shared/services/test-fixtures";
import { galleryForLinkOrThrow, hasAccess, needsPassword, openClientView, submitSelections, unlock } from "./template";

function status(galleryId: string): string {
  return sql<{ status: string }>(`select status from galleries where id = ${galleryId}`).firstOrThrow().status;
}

test("client gallery", () => {
  test("a shared link opens the gallery with its photos", () => {
    let f = makeGallery();
    let view = openClientView(galleryForLinkOrThrow(f.token));

    equal(view.photos.length, 3);
    equal(view.photographer, "Ada Lens");
    assert(!view.preview);
  });

  test("a draft is hidden from clients and previewable by its photographer", () => {
    let f = makeGallery({ status: "draft" });

    try {
      galleryForLinkOrThrow(f.token);
      errorf("expected the draft to be hidden");
    } catch (err: any) {
      equal(err.statusCode, 404);
    }

    signInAs(f.userId);
    assert(openClientView(galleryForLinkOrThrow(f.token)).preview);
  });

  test("a password gallery needs the password, and the grant it returns opens it", () => {
    let f = makeGallery({ password: "tuscany" });
    let g = galleryForLinkOrThrow(f.token);

    assert(needsPassword(g));
    assert(!hasAccess(g, ""));

    try {
      unlock(f.token, "wrong");
      errorf("expected a wrong password to be refused");
    } catch (err: any) {
      equal(err.statusCode, 401);
    }

    let grant = unlock(f.token, "tuscany");
    assert(hasAccess(g, grant));
    assert(!hasAccess(g, grant.replace(/^./, "x")));
  });

  test("changing the password revokes old grants", () => {
    let f = makeGallery({ password: "tuscany" });
    let grant = unlock(f.token, "tuscany");

    sql(`update galleries set passwordHash = crypt('siena', genSalt('bf', 4)) where id = ${f.galleryId}`);
    assert(!hasAccess(galleryForLinkOrThrow(f.token), grant));
  });

  test("submitting selections marks the gallery submitted", () => {
    let f = makeGallery();
    sql(`insert into favorites (galleryId, photoId) values (${f.galleryId}, ${f.photoIds[1]})`);

    equal(submitSelections(f.token, ""), "submitted");
    equal(status(f.galleryId), "submitted");
  });

  test("a password gallery refuses a submit without the grant", () => {
    let f = makeGallery({ password: "tuscany" });

    try {
      submitSelections(f.token, "");
      errorf("expected the submit to be refused");
    } catch (err: any) {
      equal(err.statusCode, 401);
    }

    equal(status(f.galleryId), "shared");
  });

  test("final selections cannot be resubmitted", () => {
    let f = makeGallery({ status: "final" });

    try {
      submitSelections(f.token, "");
      errorf("expected the submit to be refused");
    } catch (err: any) {
      equal(err.statusCode, 403);
    }
  });
});
