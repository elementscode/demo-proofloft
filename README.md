![Proofloft, a client proofing app built with Elements: an engagement gallery in a full-width photo grid, with hearts on the client's favorites and comment counts on the photos they asked about.](https://elements.dev/demos/01a0f424-a33a-7f14-94c0-cfe190131ec9/poster?v=c703bbd63234)

# Proofloft

> A demo app built with [Elements](https://elements.dev).

Private photo galleries where clients heart favorites and comment live, and the photographer downloads the chosen file names.

**Demo:** [Proofloft](https://elements.dev/demos/01a0f424-a33a-7f14-94c0-cfe190131ec9)

## Agent specs

What one run of the prompt below took, from an empty Elements project to this
app.

- **Agent:** Claude Code, Opus 5.5 Medium
- **Time:** 26 min
- **Cost:** $7.73 at API rates, September 2026

## Get started

```bash
elements create proofloft -scaffold=elementscode/demo-proofloft
```

## How it's built

Proofloft needed private galleries a client opens from a link, photo uploads, hearts and comments that both sides see as they happen, emails at each handoff and a file of the chosen names for the photographer. Each of those is a part of Elements, so the agent spent its 26 minutes on the galleries themselves.

### What Elements gave the app

- **Live hearts and comments.** Favorites and comments are LiveTables. A client hearts a photo and the photographer's open gallery shows it at once, and a reply lands under the client's comment the same way. Once a gallery is final, the client's picks are locked in. A channel tells the photographer the moment a client submits.
- **Client access from a link.** A client opens their gallery from the private link in their email and enters its password once; a cookie for that gallery keeps them in.
- **Uploads into the database.** The photographer uploads photos straight from a form, the bytes are stored in the database, and each photo is served at a url made from its id and a hash of its bytes.
- **Emails at each handoff.** Sharing a gallery emails the client the link, and submitting selections emails the photographer the picks.
- **Server calls as function calls.** Creating a gallery, uploading, inviting the client and marking selections final call server functions straight from the page with `@rpc`, and the photographer downloads the chosen file names as a text file.
- **Data from SQL files.** Migrations define the studio and seed one photographer, three galleries with 82 photos, and one client's hearts and comments.

### What the project server gave the agent

The project server runs alongside the agent and answers as soon as a file is saved: it type-checks the templates, TypeScript and SQL, applies migrations and reruns the tests, so every question came back right away and the agent kept building.

### What shipped

The app type-checks with zero errors and all 26 tests pass. Every page works on desktop and phone.

## Demo account and seed data

Sign in as the photographer with `nora@proofloft.studio` and the password
`proofloft`. The sign-in page shows this login and has a "Sign in as Nora"
button. Clients have no account: they open a gallery from its private link.

The seed creates three of Nora's galleries:

| Gallery | Photos | State | Client link |
| ------- | ------ | ----- | ----------- |
| Giulia & Sam, wedding | 28 | Shared, password `villa2026` | `/g/7c1e9a4f2b8d6e3a0c5f` |
| Harper & Theo, engagement | 26 | Selections submitted, 11 favorites, 7 comments | `/g/3f8b2d6a9e1c4b7f0a2d` |
| The Okafor family, autumn session | 28 | Draft, only Nora can preview it | |

In development the invite and "selections submitted" emails are written to
`.elements/logs/program.log` instead of being sent.

The seeded photos are CC0 images from Wikimedia Commons, resized for the web.

## The prompt

```text
Build a client proofing app named proofloft for a wedding and portrait
photographer.

PHOTOGRAPHER (admin account)
- Create a gallery for a client: name, date, upload photos in bulk.
- Share it with a private link and optional password, emailed to the client.
- See which photos the client favorited, and their comments.
- Mark a gallery's selections final and download the list of chosen file
  names.

CLIENT (no account, from the link)
- A full-screen gallery grid with a lightbox.
- Heart favorites, leave a comment on a photo, and submit selections when
  done. The photographer gets an email.

Seed the photographer and three galleries of 20 to 30 photos each, one with
favorites and comments. Show the admin login on the sign-in page.

Favorites and comments appear to the photographer in real time.
```

## License

MIT. See [LICENSE](LICENSE).
