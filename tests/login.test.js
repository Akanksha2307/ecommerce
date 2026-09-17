import { describe, expect, test, vi, beforeEach } from "vitest";
import { loginUser } from "../src/services/authService";

describe("Login", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("login succeeds with valid credentials", async () => {
    const mockResponse = {
      token: "test-jwt-token",
      user: {
        email: "test@example.com",
        name: "Test User",
      },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })
    );

    const result = await loginUser({
      email: "test@example.com",
      password: "password123",
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/login"),
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  test("login fails with invalid credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          message: "Invalid credentials",
        }),
      })
    );

    await expect(
      loginUser({
        email: "wrong@example.com",
        password: "wrongpassword",
      })
    ).rejects.toThrow("Invalid credentials");
  });
});