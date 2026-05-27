import type { Connect4State, Connect4View } from "@gamenite/shared";
import type { GameLogic } from "./gameLogic.ts";
import { GameService } from "./gameServiceManager.ts";

export const connect4Logic: GameLogic<Connect4State, Connect4View> = {
  minPlayers: 2,
  maxPlayers: 2,

  start: () => {
    throw new Error("unimplemented");
  },

  update: (state, payload, playerIndex) => {
    throw new Error("unimplemented");
  },

  isDone: (state) => {
    throw new Error("unimplemented");
  },

  viewAs: (state) => {
    throw new Error("unimplemented");
  },

  tagView: (view) => ({ type: "connect4", view }),
};

export const connect4GameService = new GameService<Connect4State, Connect4View>(connect4Logic);
