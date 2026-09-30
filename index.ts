import { App, redirect, session } from "@elements/app";
import config from "#config";
import signin from "#app/pages/signin";
import admin from "#app/pages/admin";
import gallery from "#app/pages/gallery";
import adminGallery from "#app/pages/admin-gallery";
import newGallery from "#app/pages/new-gallery";
import servePhoto from "#app/routes/photos";
import downloadSelections from "#app/routes/selections";
import notFound from "#app/pages/errors/not-found";
import unhandled from "#app/pages/errors/unhandled";

const app = new App();

app.route("/", () => redirect(session.isLoggedIn() ? "/admin" : "/signin"));
app.route("/signin", signin);
app.route("/admin", admin);
app.route("/admin/galleries/new", newGallery);
app.route("/admin/galleries/:id", adminGallery);
app.route("/admin/galleries/:id/selections.txt", downloadSelections);
app.route("/g/:token", gallery);
app.route("/photos/:id/:hash", servePhoto);

app.error((req, res, err) => {
  switch (err.statusCode) {
    case 404:
      return notFound(req, res, err);

    default:
      return unhandled(req, res, err);
  }
});

app.start(config);
