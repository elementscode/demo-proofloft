import { Request, Response } from "@elements/app";
import html, { galleryForLinkOrThrow, grantCookie, hasAccess, lockedInfo, openClientView } from "./template";

function readCookie(req: Request, name: string): string {
  let header = String(req.headers?.cookie ?? "");

  for (let part of header.split(";")) {
    let [key, ...rest] = part.trim().split("=");

    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return "";
}

export default function route(req: Request, res: Response) {
  let token = req.params.token;
  let gallery = galleryForLinkOrThrow(token);
  let grant = readCookie(req, grantCookie(token));

  res.setHeader("X-Robots-Tag", "noindex");

  if (!hasAccess(gallery, grant)) {
    return new html({ token, locked: lockedInfo(gallery), initial: null });
  }

  return new html({ token, locked: lockedInfo(gallery), initial: openClientView(gallery), grant });
}
