-- add proofing tables

-- Auto-update updatedAt on row changes.
create or replace function touchUpdatedAt()
returns trigger
language plpgsql
as $$
begin
  new.updatedAt = now();
  return new;
end;
$$;

create table users (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  email text not null unique,
  name text not null,
  studio text not null,
  passwordHash text not null
);

create trigger usersTouchUpdatedAt
  before update on users
  for each row execute function touchUpdatedAt();

create table galleries (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  userId uuid not null references users(id) on delete cascade,
  name text not null,
  eventDate date not null,
  clientName text not null default '',
  clientEmail text not null default '',
  -- The private link. Unguessable, and the only way a client reaches the gallery.
  shareToken text not null unique default encode(gen_random_bytes(12), 'hex'),
  passwordHash text,
  status text not null default 'draft' check (status in ('draft', 'shared', 'submitted', 'final')),
  sharedAt timestamptz,
  submittedAt timestamptz,
  finalizedAt timestamptz
);

create index galleriesUserIdIdx on galleries (userId);

create trigger galleriesTouchUpdatedAt
  before update on galleries
  for each row execute function touchUpdatedAt();

create table photos (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  galleryId uuid not null references galleries(id) on delete cascade,
  name text not null,
  position integer not null default 0,
  width integer,
  height integer,
  contentType text not null default 'image/jpeg',
  size integer not null default 0,
  -- Uploaded bytes. Seeded photos ship as static assets and name one by seedKey instead.
  data bytea,
  seedKey text,
  hash text generated always as (encode(sha256(data), 'hex')) stored,
  check (data is not null or seedKey is not null)
);

create index photosGalleryIdIdx on photos (galleryId, position);

create trigger photosTouchUpdatedAt
  before update on photos
  for each row execute function touchUpdatedAt();

create table favorites (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  galleryId uuid not null references galleries(id) on delete cascade,
  photoId uuid not null references photos(id) on delete cascade,
  -- A gallery has one client, so a photo is either a favorite or it is not.
  unique (photoId)
);

create index favoritesGalleryIdIdx on favorites (galleryId);

create trigger favoritesTouchUpdatedAt
  before update on favorites
  for each row execute function touchUpdatedAt();

create table comments (
  id uuid primary key default uuidGenerateV7(),
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now(),
  galleryId uuid not null references galleries(id) on delete cascade,
  photoId uuid not null references photos(id) on delete cascade,
  author text not null check (author in ('client', 'photographer')),
  body text not null check (length(body) between 1 and 2000)
);

create index commentsGalleryIdIdx on comments (galleryId);

create trigger commentsTouchUpdatedAt
  before update on comments
  for each row execute function touchUpdatedAt();
