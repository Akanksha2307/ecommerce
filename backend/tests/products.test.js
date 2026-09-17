import request from "supertest";
import { describe, expect, test } from "vitest";
import app from "../server.js";

describe("GET /api/products", () => {
  test("returns a list of products with status 200", async () => {
    const response =
      await request(app)
        .get("/api/products");

    expect(response.statusCode)
      .toBe(200);

    expect(Array.isArray(response.body))
      .toBe(true);
  });
});