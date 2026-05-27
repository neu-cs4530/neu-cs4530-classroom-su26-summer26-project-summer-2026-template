import { describe, expect, it } from "vitest";

// Delete these tests when you actually write tests for ticTacToe
describe("parseInt", () => {
  it("should parse '7' correctly", () => {
    expect(parseInt("7")).toBe(7);
  });

  it("should parse '7abc' as 7, I think this is weird but that's the spec", () => {
    expect(parseInt("7abc")).toBe(7);
  });
});
