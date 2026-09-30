import { Request, Response, sql } from "@elements/app";
import { ownGalleryOrThrow } from "#app/shared/services/galleries";

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "gallery";
}

/** The chosen file names, one per line, for the photographer's editing software. */
export default function downloadSelections(req: Request, res: Response) {
  let gallery = ownGalleryOrThrow(req.params.id);

  let names = sql<{ name: string }>(`
    select p.name
      from favorites f
      join photos p on p.id = f.photoId
     where f.galleryId = ${gallery.id}
     order by p.position, p.name
  `).all().map((r) => r.name);

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${slug(gallery.name)}-selections.txt"`);

  return names.join("\n") + (names.length ? "\n" : "");
}
