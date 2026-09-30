![Proofloft, a client proofing app built with Elements: an engagement gallery in a full-width photo grid, with hearts on the client's favorites and comment counts on the photos they asked about.](POSTER_URL)

# Proofloft

> A demo app built with [Elements](https://elements.dev).

Bulk-uploaded galleries shared by private link, where clients heart favorites and comment live, and the photographer downloads the chosen file names.

**Demo:** [Proofloft](TBD)

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
