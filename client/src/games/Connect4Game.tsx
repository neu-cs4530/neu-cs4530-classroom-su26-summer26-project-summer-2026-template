import type { Connect4Move, Connect4View } from "@gamenite/shared";
import type { GameProps } from "../util/types.ts";
import "./Connect4.css";

export default function Connect4Game({
  view,
  userPlayerIndex,
  makeMove,
}: GameProps<Connect4View, Connect4Move>) {
  const disabled = userPlayerIndex !== view.nextPlayer;

  const isWinner = (row: number, col: number) =>
    view.winningEntry?.some(([wr, wc]) => wr === row && wc === col);

  return (
    <div className="c4-board">
      {view.board.map((entries, row) => (
        <div className="c4-row" key={row}>
          {entries.map((entry, col) => (
            <span className={`c4-cell${isWinner(row, col) ? " c4-winner" : ""}`} key={col}>
              {entry !== "." ? (
                <span className={entry === "R" ? "c4-disc c4-red" : "c4-disc c4-yellow"} />
              ) : !view.winningEntry && userPlayerIndex >= 0 ? (
                <button
                  className="c4-drop-btn"
                  disabled={disabled}
                  onClick={() => makeMove(col)}
                  aria-label={`Drop in column ${col + 1}`}
                />
              ) : null}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
