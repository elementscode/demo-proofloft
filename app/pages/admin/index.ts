import { Request, Response } from "@elements/app";
import { photographerOrRedirect } from "#app/shared/services/galleries";
import html, { gallerySummaries } from "./template";

export default function route(req: Request, res: Response) {
  let userId = photographerOrRedirect();

  if (!userId) {
    return;
  }

  return new html({ galleries: gallerySummaries(userId) });
}
