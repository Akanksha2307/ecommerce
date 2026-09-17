import request from "supertest";
import { describe, test, expect, beforeAll, afterAll } from "vitest";

import app from "../server.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

// Unique identifiers per run so re-running the suite never collides with
// leftover data from a previous run.
const testEmail = `ci-cart-test-${Date.now()}@example.com`;
const testPassword = "Password123!";
const testProductId = 900000 + Math.floor(Math.random() * 90000);

let authToken;

describe("Cart - Add and Remove Items", () => {
  beforeAll(async () => {
    // Create a real user and log in to get a valid auth token.
    await request(app).post("/api/auth/register").send({
      name: "CI Cart Test User",
      email: testEmail,
      password: testPassword,
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: testPassword,
    });

    authToken = loginResponse.body.token;

    // Create a product to add to the cart.
    await Product.create({
      id: testProductId,
      title: "CI Test Product",
      price: 499,
      category: "ci-test",
      stock: 10,
    });
  });

  afterAll(async () => {
    // Clean up everything created for this test run.
    const user = await User.findOne({ email: testEmail });

    if (user) {
      await Cart.deleteOne({ userId: user._id });
    }

    await Product.deleteOne({ id: testProductId });
    await User.deleteOne({ email: testEmail });
  });

  test("adds a product to the cart", async () => {
    const response = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        id: testProductId,
        title: "CI Test Product",
        price: 499,
        quantity: 2,
      });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const addedItem = response.body.find(
      (item) => item.productId === testProductId
    );

    expect(addedItem).toBeDefined();
    expect(addedItem.quantity).toBe(2);
  });

  test("removes a product from the cart", async () => {
    const response = await request(app)
      .delete(`/api/cart/${testProductId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const removedItem = response.body.find(
      (item) => item.productId === testProductId
    );

    expect(removedItem).toBeUndefined();
  });

  test("returns 404 when removing a product that is not in the cart", async () => {
    const response = await request(app)
      .delete(`/api/cart/${testProductId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(404);
  });

  test("rejects cart access without an auth token", async () => {
    const response = await request(app).get("/api/cart");

    expect(response.statusCode).toBe(401);
  });
});
