import { equal, errorf, sql, test } from "@elements/app";
import { makeGallery, signInAs } from "#app/shared/services/test-fixtures";
import { uploadPhotos } from "#app/shared/services/uploads";
import { createGallery } from "./template";

test("new gallery", () => {
  test("creates a draft owned by the signed-in photographer", () => {
    let f = makeGallery();
    signInAs(f.userId);

    let id = createGallery({ name: " Cole & Rin ", eventDate: "2026-10-04", clientName: "Rin", clientEmail: "", password: "" });
    let row = sql<{ name: string; status: string; userId: string }>(`select name, status, userId from galleries where id = ${id}`).firstOrThrow();

    equal(row, { name: "Cole & Rin", status: "draft", userId: f.userId });
  });

  test("needs a name", () => {
    let f = makeGallery();
    signInAs(f.userId);

    try {
      createGallery({ name: "  ", eventDate: "2026-10-04", clientName: "", clientEmail: "", password: "" });
      errorf("expected a validation error");
    } catch (err: any) {
      equal(err.statusCode, 422);
    }
  });

  test("needs a signed-in photographer", () => {
    try {
      createGallery({ name: "x", eventDate: "2026-10-04", clientName: "", clientEmail: "", password: "" });
      errorf("expected an auth error");
    } catch (err: any) {
      equal(err.statusCode, 401);
    }
  });

  test("uploads append photos after the existing ones and store the bytes", () => {
    let f = makeGallery();
    signInAs(f.userId);

    let data = new Uint8Array([255, 216, 255, 224]);
    let file = { name: "DSC_9001.jpg", contentType: "image/jpeg", size: data.length, data } as any;

    equal(uploadPhotos({ galleryId: f.galleryId, files: [file], dimensions: [{ width: 1200, height: 800 }] }), 1);

    let row = sql<{ position: number; width: number; size: number }>(`
      select position, width, octet_length(data) as size from photos where name = 'DSC_9001.jpg'
    `).firstOrThrow();

    equal(row, { position: 4, width: 1200, size: 4 });
  });

  test("uploads refuse files that are not images", () => {
    let f = makeGallery();
    signInAs(f.userId);

    let data = new Uint8Array([60, 104]);
    let file = { name: "notes.html", contentType: "text/html", size: 2, data } as any;

    try {
      uploadPhotos({ galleryId: f.galleryId, files: [file], dimensions: [null] });
      errorf("expected a validation error");
    } catch (err: any) {
      equal(err.statusCode, 422);
    }
  });
});
