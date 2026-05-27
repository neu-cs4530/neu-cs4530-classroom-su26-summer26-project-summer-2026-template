import { resetStoredGames } from "./services/game.service.ts";
import { resetStoredThreads } from "./services/thread.service.ts";
import { resetStoredUsers } from "./services/user.service.ts";

/** Restore the default configuration of the website */
export function resetEverythingToDefaults() {
  resetStoredUsers();
  resetStoredThreads();
  resetStoredGames();
}
