import { beforeEach } from "vitest";
import { resetStoredThreads } from "../src/services/thread.service.ts";
import { resetStoredUsers } from "../src/services/user.service.ts";
import { resetStoredGames } from "../src/services/game.service.ts";

beforeEach(() => {
  resetStoredUsers();
  resetStoredGames();
  resetStoredThreads();
});
