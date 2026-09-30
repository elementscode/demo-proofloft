import {
  Channel,
  ForbiddenError,
  LiveTable,
  NotFoundError,
  ValidationError,
  redirect,
  session,
  sql,
} from "@elements/app";
import { SEED_PHOTOS } from "#app/shared/services/seed-photos";

export type GalleryStatus = "draft" | "shared" | "submitted" | "final";

export interface Gallery {
  id: string;
  userId: string;
  name: string;
  eventDate: Date;
  clientName: string;
  clientEmail: string;
  shareToken: string;
  hasPassword: boolean;
  status: GalleryStatus;
  sharedAt: Date | null;
  submittedAt: Date | null;
  finalizedAt: Date | null;
}

export interface Photo {
  id: string;
  galleryId: string;
  name: string;
  position: number;
  width: number | null;
  height: number | null;
  url: string;
}

export interface Favorite {
  id: string;
  galleryId: string;
  photoId: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  galleryId: string;
  photoId: string;
  author: "client" | "photographer";
  body: string;
  createdAt: Date;
}

export interface Studio {
  name: string;
  studio: string;
  email: string;
}

export interface GalleryEvent {
  galleryId: string;
  status: GalleryStatus;
  at: Date;
}

/** Status changes a client makes (submitting) reach the photographer's open page. */
export const galleryEvents = new Channel<GalleryEvent>("galleryEvents");

export interface PhotoRow {
  id: string;
  galleryId: string;
  name: string;
  position: number;
  width: number | null;
  height: number | null;
  seedKey: string | null;
  hash: string | null;
}

/**
 * Uploaded bytes are served by id and content hash. The hash makes the URL
 * unguessable, which is what lets a client with no account load them.
 */
export function photoUrl(p: PhotoRow): string {
  if (p.seedKey && SEED_PHOTOS[p.seedKey]) {
    return SEED_PHOTOS[p.seedKey];
  }

  return `/photos/${p.id}/${p.hash}`;
}

export function listPhotos(galleryId: string): Photo[] {
  let rows = sql<PhotoRow>(`
    select id, galleryId, name, position, width, height, seedKey, hash
      from photos
     where galleryId = ${galleryId}
     order by position, createdAt
  `).all();

  return rows.map((p) => ({
    id: p.id,
    galleryId: p.galleryId,
    name: p.name,
    position: p.position,
    width: p.width,
    height: p.height,
    url: photoUrl(p),
  }));
}

export function findGallery(id: string): Gallery {
  return sql<Gallery>(`
    select id, userId, name, eventDate, clientName, clientEmail, shareToken,
           passwordHash is not null as hasPassword,
           status, sharedAt, submittedAt, finalizedAt
      from galleries
     where id = ${id}
  `).firstOrThrow("gallery not found");
}

export function findGalleryByToken(token: string): Gallery | undefined {
  return sql<Gallery>(`
    select id, userId, name, eventDate, clientName, clientEmail, shareToken,
           passwordHash is not null as hasPassword,
           status, sharedAt, submittedAt, finalizedAt
      from galleries
     where shareToken = ${token}
  `).first();
}

export function findStudio(userId: string): Studio {
  return sql<Studio>(`select name, studio, email from users where id = ${userId}`).firstOrThrow("studio not found");
}

export function isPhotographerOf(galleryId: string): boolean {
  let userId = session.get("userId");

  if (!userId) {
    return false;
  }

  return !sql(`select 1 from galleries where id = ${galleryId} and userId = ${userId}`).empty();
}

/** For a page route: a visitor who is not signed in goes to the sign-in page. */
export function photographerOrRedirect(): string | undefined {
  let userId = session.get("userId");

  if (!userId) {
    redirect("/signin");
    return undefined;
  }

  return userId;
}

/** For an rpc or data route: the gallery, if the signed-in photographer owns it. */
export function ownGalleryOrThrow(galleryId: string): Gallery {
  session.isLoggedInOrThrow();

  let gallery = findGallery(galleryId);

  if (gallery.userId !== session.getOrThrow("userId")) {
    throw new NotFoundError("gallery not found");
  }

  return gallery;
}

function galleryStatus(galleryId: string): GalleryStatus {
  return sql<{ status: GalleryStatus }>(`select status from galleries where id = ${galleryId}`)
    .firstOrThrow("gallery not found").status;
}

function photoInGalleryOrThrow(photoId: string | undefined, galleryId: string) {
  if (!photoId || sql(`select 1 from photos where id = ${photoId} and galleryId = ${galleryId}`).empty()) {
    throw new ValidationError("that photo is not in this gallery");
  }
}

/**
 * The client has no account. Holding a view is the permission: a view is only
 * opened by a route or rpc that checked the share link and password, and every
 * write through it is held to its gallery's partition.
 */
function clientCanEditOrThrow(galleryId: string) {
  if (galleryStatus(galleryId) === "final") {
    throw new ForbiddenError("this gallery's selections are final");
  }
}

export let favorites: LiveTable<Favorite> = new LiveTable<Favorite>({
  insert: (item) => {
    clientCanEditOrThrow(item.galleryId!);
    photoInGalleryOrThrow(item.photoId, item.galleryId!);
    return favorites.insert(item);
  },

  update: () => {
    throw new ForbiddenError();
  },

  delete: (item) => {
    clientCanEditOrThrow(item.galleryId);
    return favorites.delete(item);
  },
});

export let comments: LiveTable<Comment> = new LiveTable<Comment>({
  insert: (item) => {
    let photographer = isPhotographerOf(item.galleryId!);

    if (!photographer) {
      clientCanEditOrThrow(item.galleryId!);
    }

    photoInGalleryOrThrow(item.photoId, item.galleryId!);

    let body = (item.body ?? "").trim();

    if (!body) {
      throw new ValidationError("write a comment first");
    }

    return comments.insert({ ...item, body, author: photographer ? "photographer" : "client" });
  },

  update: () => {
    throw new ForbiddenError();
  },

  delete: (item) => {
    let photographer = isPhotographerOf(item.galleryId);

    if (!photographer && item.author !== "client") {
      throw new ForbiddenError();
    }

    return comments.delete(item);
  },
});

export function formatDate(d: Date | string): string {
  // A date column arrives as midnight UTC; format it in UTC so it never shifts a day.
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function plural(n: number, one: string, many: string = one + "s"): string {
  return `${n} ${n === 1 ? one : many}`;
}
