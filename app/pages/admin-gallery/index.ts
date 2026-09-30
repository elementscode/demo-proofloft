import { Request, Response } from "@elements/app";
import {
  comments,
  favorites,
  galleryEvents,
  listPhotos,
  ownGalleryOrThrow,
  photographerOrRedirect,
} from "#app/shared/services/galleries";
import html from "./template";

export default function route(req: Request, res: Response) {
  if (!photographerOrRedirect()) {
    return;
  }

  let gallery = ownGalleryOrThrow(req.params.id);

  return new html({
    initial: { gallery, photos: listPhotos(gallery.id) },
    favorites: favorites.view({ galleryId: gallery.id }),
    comments: comments.view({ galleryId: gallery.id }),
    events: galleryEvents.listen({ filter: (e) => e.galleryId === gallery.id }),
  });
}
