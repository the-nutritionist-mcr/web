import { loginToCognito } from "./login-to-cognito";

describe("backend stack userpool", () => {
  it("accepts a login and returns a token", async () => {
    const token = await loginToCognito();
    expect(token).not.toBeNull();
  });
});
