import { session, sql } from "@elements/app";

export interface Fixture {
  userId: string;
  galleryId: string;
  token: string;
  photoIds: string[];
}

/** A photographer with one gallery of three seeded photos. Tests roll it back. */
export function makeGallery(opts: { email?: string; status?: string; password?: string } = {}): Fixture {
  let user = sql<{ id: string }>(`
    insert into users (email, name, studio, passwordHash)
         values (${opts.email ?? "ada@example.com"}, 'Ada Lens', 'Ada Lens Studio', crypt('pw123456', genSalt('bf', 4)))
      returning id
  `).firstOrThrow();

  let gallery = sql<{ id: string; shareToken: string }>(`
    insert into galleries (userId, name, eventDate, clientName, clientEmail, status, passwordHash)
         values (${user.id}, 'Test wedding', '2026-09-01', 'Bea Client', 'bea@example.com', ${opts.status ?? "shared"},
                 case when ${opts.password ?? ""} = '' then null else crypt(${opts.password ?? ""}, genSalt('bf', 4)) end)
      returning id, shareToken
  `).firstOrThrow();

  let photoIds = ["wedding-01", "wedding-02", "wedding-03"].map((key, i) =>
    sql<{ id: string }>(`
      insert into photos (galleryId, name, position, width, height, seedKey)
           values (${gallery.id}, ${`IMG_00${i + 1}.jpg`}, ${i + 1}, 1350, 900, ${key})
        returning id
    `).firstOrThrow().id,
  );

  return { userId: user.id, galleryId: gallery.id, token: gallery.shareToken, photoIds };
}

export function signInAs(userId: string) {
  session.login({ userId, userName: "Ada Lens" });
}
