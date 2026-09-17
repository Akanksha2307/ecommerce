import { describe, expect, test } from "vitest";

describe("GreenCart Backend", () => {
  test("basic calculation works", () => {
    expect(2 + 2).toBe(4);
  });

  test("backend test environment is working", () => {
    expect("GreenCart").toBe("GreenCart");
  });
});// CI test