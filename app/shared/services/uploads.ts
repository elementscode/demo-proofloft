import { File, ValidationError, sql, tx } from "@elements/app";
import { ownGalleryOrThrow } from "#app/shared/services/galleries";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 25 * 1024 * 1024;

export interface Dimensions {
  width: number;
  height: number;
}

export interface UploadForm {
  galleryId: string;
  files: File[];
  dimensions: (Dimensions | null)[];
}

/** @rpc */
export function uploadPhotos(form: UploadForm): number {
  ownGalleryOrThrow(form.galleryId);

  for (let f of form.files) {
    if (!ALLOWED.has(f.contentType)) {
      throw new ValidationError(`${f.name} is not a JPEG, PNG or WebP image`);
    }

    if (f.size > MAX_BYTES) {
      throw new ValidationError(`${f.name} is larger than 25 MB`);
    }
  }

  return tx(() => {
    let next = sql<{ n: number }>(`
      select coalesce(max(position), 0)::int as n from photos where galleryId = ${form.galleryId}
    `).firstOrThrow().n;

    form.files.forEach((f, i) => {
      let d = form.dimensions[i];

      sql(`
        insert into photos (galleryId, name, position, width, height, contentType, size, data)
             values (${form.galleryId}, ${f.name}, ${next + i + 1}, ${d?.width ?? null}, ${d?.height ?? null},
                     ${f.contentType}, ${f.size}, ${f.data})
      `);
    });

    return form.files.length;
  });
}

/** Reads an image's pixel size in the browser, so the grid can lay it out before it loads. */
export async function readDimensions(f: File): Promise<Dimensions | null> {
  try {
    let bitmap = await createImageBitmap(new Blob([f.data as BlobPart], { type: f.contentType }));
    let d = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return d;
  } catch {
    return null;
  }
}
