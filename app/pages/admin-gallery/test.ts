import { assert, equal, errorf, sql, test } from "@elements/app";
import { makeGallery, signInAs } from "#app/shared/services/test-fixtures";
import { removePassword, sendInvite, setFinal } from "./template";

test("admin gallery", () => {
  test("emailing the link shares a draft and sets the password", () => {
    let f = makeGallery({ status: "draft" });
    signInAs(f.userId);

    let g = sendInvite({
      galleryId: f.galleryId,
      clientName: "Bea Client",
      clientEmail: " BEA@Example.com ",
      password: "siena",
      message: "",
    });

    equal(g.status, "shared");
    equal(g.clientEmail, "bea@example.com");
    assert(g.hasPassword);
    assert(g.sharedAt !== null);
  });

  test("an invite needs a real email address", () => {
    let f = makeGallery();
    signInAs(f.userId);

    try {
      sendInvite({ galleryId: f.galleryId, clientName: "", clientEmail: "nope", password: "", message: "" });
      errorf("expected a validation error");
    } catch (err: any) {
      equal(err.statusCode, 422);
    }
  });

  test("marking final, then reopening, returns to where the client left it", () => {
    let f = makeGallery({ status: "submitted" });
    signInAs(f.userId);
    sql(`update galleries set submittedAt = now() where id = ${f.galleryId}`);

    let final = setFinal(f.galleryId, true);
    equal(final.status, "final");
    assert(final.finalizedAt !== null);

    let reopened = setFinal(f.galleryId, false);
    equal(reopened.status, "submitted");
    equal(reopened.finalizedAt, null);
  });

  test("removing the password leaves a link-only gallery", () => {
    let f = makeGallery({ password: "tuscany" });
    signInAs(f.userId);

    assert(!removePassword(f.galleryId).hasPassword);
  });

  test("another photographer cannot finalize the gallery", () => {
    let f = makeGallery();
    let other = makeGallery({ email: "other@example.com" });
    signInAs(other.userId);

    try {
      setFinal(f.galleryId, true);
      errorf("expected a not found error");
    } catch (err: any) {
      equal(err.statusCode, 404);
    }
  });
});
