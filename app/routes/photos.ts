import { Request, Response, sql } from "@elements/app";

interface PhotoBytes {
  contentType: string;
  hash: string;
  data: Buffer;
}

const INLINE = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * The client has no account, so the url is the capability: the id plus a
 * sha256 of the bytes cannot be guessed.
 */
export default function servePhoto(req: Request, res: Response) {
  let photo = sql<PhotoBytes>(`
    select contentType, hash, data from photos where id = ${req.params.id}::uuid and data is not null
  `).firstOrThrow("photo not found");

  if (photo.hash !== req.params.hash) {
    res.status(404);
    return res.end();
  }

  if (INLINE.has(photo.contentType)) {
    res.setHeader("Content-Type", photo.contentType);
  } else {
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment");
  }

  res.setHeader("Cache-Control", "private, max-age=31536000, immutable");

  return photo.data;
}
