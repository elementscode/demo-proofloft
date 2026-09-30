import { assert, equal, errorf, session, test } from "@elements/app";
import { signin } from "#app/shared/services/auth";
import { makeGallery } from "#app/shared/services/test-fixtures";

test("signin", () => {
  test("signs the photographer in with the right password", () => {
    let f = makeGallery();

    signin(" ADA@example.com ", "pw123456");
    equal(session.get("userId"), f.userId);
  });

  test("refuses a wrong password without saying which part was wrong", () => {
    makeGallery();

    try {
      signin("ada@example.com", "nope");
      errorf("expected an auth error");
    } catch (err: any) {
      equal(err.message, "invalid email or password");
    }

    assert(!session.isLoggedIn());
  });
});
