import { describe, expect, it } from "vitest";
import { createGame } from "./game.service.ts";
import { getUserByUsername, populateSafeUserInfo } from "./user.service.ts";

describe("createGame", () => {
  it("puts the initial user in the list of games", () => {
    const user1 = getUserByUsername("user1")!;
    const user2 = getUserByUsername("user2")!;
    const time = new Date();
    expect(createGame(user1, "guess", time)).toStrictEqual({
      gameId: expect.anything(),
      chat: expect.anything(),
      createdAt: time,
      createdBy: populateSafeUserInfo(user1.userId),
      players: [populateSafeUserInfo(user1.userId)],
      minPlayers: 2,
      status: "waiting",
      type: "guess",
    });
    expect(createGame(user2, "guess", time)).toStrictEqual({
      gameId: expect.anything(),
      chat: expect.anything(),
      createdAt: time,
      createdBy: populateSafeUserInfo(user2.userId),
      players: [populateSafeUserInfo(user2.userId)],
      minPlayers: 2,
      status: "waiting",
      type: "guess",
    });
  });
});
