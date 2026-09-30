import { Request, Response } from "@elements/app";
import { photographerOrRedirect } from "#app/shared/services/galleries";
import html from "./template";

export default function route(req: Request, res: Response) {
  if (!photographerOrRedirect()) {
    return;
  }

  return new html();
}
