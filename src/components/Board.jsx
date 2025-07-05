import { useState } from "react";


export default function Board({ board, setSelectedCell, selectedCell }) {
  return (
    <div className="flex flex-col border-2">
      {[0, 1, 2].map((blockRow) => (
        <ORow
          key={blockRow}
          blockRow={blockRow}
          board={board}
          setSelectedCell={setSelectedCell}
          selectedCell={selectedCell}
        />
      ))}
    </div>
  );
}


function ORow({ blockRow, board, setSelectedCell, selectedCell }) {
    return (
        <div className="flex">
            {[0, 1, 2].map((blockCol) => (
                <Block
                    key={blockCol}
                    blockRow={blockRow}
                    blockCol={blockCol}
                    board={board}
                    setSelectedCell={setSelectedCell}
                    selectedCell={selectedCell}
                />
            ))}
        </div>
    );
}


function Block({ blockRow, blockCol, board, setSelectedCell, selectedCell }) {
  return (
    <div className="flex flex-col border">
      {[0, 1, 2].map((i) => (
        <IRow
          key={i}
          row={blockRow * 3 + i}
          colOffset={blockCol * 3}
          board={board}
          setSelectedCell={setSelectedCell}
          selectedCell={selectedCell}
        />
      ))}
    </div>
  );
}


function IRow({ row, colOffset, board, setSelectedCell, selectedCell }) {
  return (
    <div className="flex">
      {[0, 1, 2].map((j) => {
        const col = colOffset + j;
        return (
          <Cell
            key={col}
            row={row}
            col={col}
            value={board[row][col]}
            setSelectedCell={setSelectedCell}
            selectedCell={selectedCell}
          />
        );
      })}
    </div>
  );
}


function Cell({ row, col, value, setSelectedCell, selectedCell }) {
  const isSelected = selectedCell.row === row && selectedCell.col === col;

  return (
    <div
      onClick={() => setSelectedCell({ row, col })}
      className={`border w-12 h-12 flex items-center justify-center cursor-pointer font-bold
                  ${isSelected ? "bg-blue-200" : "hover:bg-gray-100"}`}
    >
      {value || ''}
    </div>
  );
}
