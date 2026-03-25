import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthService from "../auth.service";
import * as requestModule from "../request";

describe("authService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it("login calls request", async () => {
    const spy = vi
      .spyOn(requestModule, "request")
      .mockResolvedValue({ accessToken: "z", refreshToken: "x" });

    const res = await authService.login("a", "b");

    expect(spy).toHaveBeenCalled();
    expect(res.accessToken).toBe("z");
  });
});
