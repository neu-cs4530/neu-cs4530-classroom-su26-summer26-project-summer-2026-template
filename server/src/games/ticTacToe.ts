import { zTicTacToeMove, type TicTacToeState, type TicTacToeView } from "@gamenite/shared";
import type { GameLogic } from "./gameLogic.ts";
import { GameService } from "./gameServiceManager.ts";

function findWinningEntry({ board }: TicTacToeState): TicTacToeView["winningEntry"] {
  for (let row = 0; row < 3; row += 1) {
    if (
      board[row][0] !== "." &&
      board[row][0] === board[row][1] &&
      board[row][1] === board[row][2]
    ) {
      return [
        [row, 0],
        [row, 1],
        [row, 2],
      ];
    }
  }

  for (let col = 0; col < 3; col += 1) {
    if (
      board[0][col] !== "." &&
      board[0][col] === board[1][col] &&
      board[1][col] === board[2][col]
    ) {
      return [
        [0, col],
        [1, col],
        [2, col],
      ];
    }
  }

  if (board[1][1] !== ".") {
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return [
        [0, 0],
        [1, 1],
        [2, 2],
      ];
    }

    if (board[2][0] === board[1][1] && board[1][1] === board[0][2]) {
      return [
        [2, 0],
        [1, 1],
        [0, 2],
      ];
    }
  }

  return null;
}

export const ticTacToeLogic: GameLogic<TicTacToeState, TicTacToeView> = {
  minPlayers: 2,
  maxPlayers: 2,
  start: () => ({
    board: [
      [".", ".", "."],
      [".", ".", "."],
      [".", ".", "."],
    ],
    nextPlayer: 1,
  }),

  update: (state, payload, playerIndex) => {
    if (state.nextPlayer !== playerIndex) return null;
    if (findWinningEntry(state) !== null) return null;
    const safeMove = zTicTacToeMove.safeParse(payload);
    if (safeMove.error) return null;
    const [row, col] = safeMove.data;
    if (state.board[row][col] !== ".") return null;
    state.board[row][col] = playerIndex === 0 ? "O" : "X";
    return { ...state, nextPlayer: playerIndex === 0 ? 1 : 0 };
  },

  isDone: (state) => {
    return (
      findWinningEntry(state) !== null ||
      state.board.every((row) => row.every((pos) => pos !== "."))
    );
  },

  viewAs: (state) => {
    return {
      board: state.board,
      nextPlayer: state.nextPlayer,
      winningEntry: findWinningEntry(state),
    };
  },

  tagView: (view) => ({ type: "tictactoe", view }),
};

export const ticTacToeGameService = new GameService<TicTacToeState, TicTacToeView>(ticTacToeLogic);
