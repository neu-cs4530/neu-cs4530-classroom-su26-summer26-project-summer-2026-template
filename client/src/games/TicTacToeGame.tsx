import type { TicTacToeMove, TicTacToeView } from "@gamenite/shared";
import type { GameProps } from "../util/types.ts";
import "./TicTacToe.css";

export default function TicTacToeGame({
  view,
  userPlayerIndex,
  makeMove,
}: GameProps<TicTacToeView, TicTacToeMove>) {
  const disabled = userPlayerIndex !== view.nextPlayer;
  const me = userPlayerIndex === 0 ? "O" : "X";

  const isWinner = (row: number, col: number) =>
    view.winningEntry?.some(([winRow, winCol]) => winRow === row && winCol === col);

  const viewEntry = (row: number, col: number, entry: "O" | "X" | ".") => {
    if (entry !== ".") {
      const markClass = entry === "O" ? "ttt-mark-o" : "ttt-mark-x";
      return <span className={markClass}>{entry}</span>;
    }
    if (userPlayerIndex === -1) return "";
    if (view.winningEntry) return "";
    return (
      <button className="ttt-move-btn" disabled={disabled} onClick={() => makeMove([row, col])}>
        {me}?
      </button>
    );
  };

  return (
    <div className="ttt-board">
      {view.board.map((entries, row) => (
        <div className="ttt-row" key={row}>
          {entries.map((entry, col) => (
            <span className={`ttt-cell${isWinner(row, col) ? " ttt-winner" : ""}`} key={col}>
              {viewEntry(row, col, entry)}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
