import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "vitest";

import app from "../server.js";
import User from "../models/User.js";

// Use a unique email per run so re-running the suite (locally or in CI)
// never collides with a leftover user from a previous run.
const testEmail = `ci-login-test-${Date.now()}@example.com`;
const testPassword = "Password123!";

describe("Auth - Login", () => {
  beforeAll(async () => {
    // Create a real user to log in with, via the actual register endpoint.
    await request(app).post("/api/auth/register").send({
      name: "CI Login Test User",
      email: testEmail,
      password: testPassword,
    });
  });

  afterAll(async () => {
    // Clean up the user created for this test run.
    await User.deleteOne({ email: testEmail });
  });

  test("logs in successfully with valid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: testPassword,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(testEmail);
  });

  test("rejects login with an incorrect password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "WrongPassword!",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  test("rejects login for an email that does not exist", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: `no-such-user-${Date.now()}@example.com`,
      password: "whatever123",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid email or password");
  });

  test("rejects login when the password field is missing", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testEmail,
    });

    // The controller has no explicit body validation for login, so a
    // missing password falls through to the bcrypt comparison, which
    // throws and is caught as a server error rather than a 401.
    expect(response.statusCode).toBe(500);
  });
});