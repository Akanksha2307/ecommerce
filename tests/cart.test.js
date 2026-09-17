import {
  describe,
  expect,
  test,
  vi,
  beforeEach,
} from "vitest";

import { configureStore } from "@reduxjs/toolkit";

import cartReducer, {
  addToCart,
  removeFromCart,
} from "../src/redux/slices/cartSlice";


describe("Cart Unit Tests", () => {

  beforeEach(() => {

    vi.restoreAllMocks();

    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => "test-token"),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

  });


  test("adds a product to cart successfully", async () => {

    const product = {
      id: 1,
      title: "Laptop",
      price: 50000,
      stock: 10,
      thumbnail: "laptop.jpg",
    };

    const mockCart = [
      {
        id: 1,
        title: "Laptop",
        price: 50000,
        quantity: 1,
      },
    ];


    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCart,
      })
    );


    const store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });


    const result =
      await store.dispatch(
        addToCart(product)
      );


    expect(fetch)
      .toHaveBeenCalledTimes(1);


    expect(fetch)
      .toHaveBeenCalledWith(
        expect.stringContaining("/api/cart"),
        expect.objectContaining({
          method: "POST",
        })
      );


    expect(result.type)
      .toBe("cart/addToCart/fulfilled");


    expect(result.payload)
      .toEqual(mockCart);

  });


  test("deletes a product from cart successfully", async () => {

    const productId = 1;

    const mockCart = [];


    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCart,
      })
    );


    const store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });


    const result =
      await store.dispatch(
        removeFromCart(productId)
      );


    expect(fetch)
      .toHaveBeenCalledTimes(1);


    expect(fetch)
      .toHaveBeenCalledWith(
        expect.stringContaining("/api/cart/1"),
        expect.objectContaining({
          method: "DELETE",
        })
      );


    expect(result.type)
      .toBe(
        "cart/removeFromCart/fulfilled"
      );


    expect(result.payload)
      .toEqual(mockCart);

  });

});