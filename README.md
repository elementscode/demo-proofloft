![Client photo proofing galleries, built by Claude Code on Elements: an engagement gallery in a full-width photo grid, with hearts on the client's favorites and comment counts on the photos they asked about.](https://elements.dev/demos/01a0f424-a33a-7f14-94c0-cfe190131ec9/poster?v=c703bbd63234)

# Client photo proofing galleries, built by Claude Code on Elements

> Proofloft is a full-stack app built with Claude Code on Elements.

Private photo galleries where clients heart favorites and comment live, and the photographer downloads the chosen file names.

[Run this app on your machine](https://elements.dev/demos/01a0f424-a33a-7f14-94c0-cfe190131ec9). Use this demo as inspiration, or as the starting point for your own app. Your agent creates a new app with this one as the scaffold, and you prompt it to add whatever features you want.

## How it's built

Proofloft needed private galleries a client opens from a link, photo uploads, hearts and comments that both sides see as they happen, emails at each handoff and a file of the chosen names for the photographer. Each of those is a part of Elements, so the agent spent its 26 minutes on the galleries themselves.

- **Live hearts and comments.** Favorites and comments are LiveTables. A client hearts a photo and the photographer's open gallery shows it at once, and a reply lands under the client's comment the same way. Once a gallery is final, the client's picks are locked in. A channel tells the photographer the moment a client submits.

- **Client access from a link.** A client opens their gallery from the private link in their email and enters its password once; a cookie for that gallery keeps them in.

- **Uploads into the database.** The photographer uploads photos straight from a form, the bytes are stored in the database, and each photo is served at a url made from its id and a hash of its bytes.

- **Emails at each handoff.** Sharing a gallery emails the client the link, and submitting selections emails the photographer the picks.

- **Server calls as function calls.** Creating a gallery, uploading, inviting the client and marking selections final call server functions straight from the page with `@rpc`, and the photographer downloads the chosen file names as a text file.

- **Data from SQL files.** Migrations define the studio and seed one photographer, three galleries with 82 photos, and one client's hearts and comments.

## Why Elements

Elements is an integrated full-stack app framework and a project server. The project server checks the agent's work as it builds: it type-checks the server and browser code, analyzes the program, applies migrations and runs the tests, then reports the results to the agent. A security mistake, such as calling a server-only function from the browser, is a compile error. The agent reads the report and fixes its own mistakes before it tells you a feature is done. The same checks run on every feature you ask for next.
