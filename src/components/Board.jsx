export default function Board({ board, setSelectedCell, selectedCell, highlightValue, setHighlightValue }) {
    return (
        <div className="flex flex-col border-2">
            {[0, 1, 2].map((blockRow) => (
                <ORow
                    key={blockRow}
                    blockRow={blockRow}
                    board={board}
                    setSelectedCell={setSelectedCell}
                    selectedCell={selectedCell}
                    highlightValue={highlightValue}
                    setHighlightValue={setHighlightValue}
                />
            ))}
        </div>
    );
}


function ORow({ blockRow, board, setSelectedCell, selectedCell, highlightValue, setHighlightValue }) {
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
                    highlightValue={highlightValue}
                    setHighlightValue={setHighlightValue}
                />
            ))}
        </div>
    );
}


function Block({ blockRow, blockCol, board, setSelectedCell, selectedCell, highlightValue, setHighlightValue }) {
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
                    highlightValue={highlightValue}
                    setHighlightValue={setHighlightValue}
                />
            ))}
        </div>
    );
}


function IRow({ row, colOffset, board, setSelectedCell, selectedCell, highlightValue, setHighlightValue }) {
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
                        highlightValue={highlightValue}
                        setHighlightValue={setHighlightValue}
                    />
                );
            })}
        </div>
    );
}


function Cell({ row, col, value, setSelectedCell, selectedCell, highlightValue, setHighlightValue }) {
    const isSelected = selectedCell.row === row && selectedCell.col === col;
    const isHighlighted = value !== '' && value === highlightValue;

    const isInFocus =
        selectedCell.row !== null &&
        (
            row === selectedCell.row ||
            col === selectedCell.col ||
            (Math.floor(row / 3) === Math.floor(selectedCell.row / 3) &&
                Math.floor(col / 3) === Math.floor(selectedCell.col / 3))
        );

    const handleClick = () => {
        setSelectedCell({ row, col });
        (value || null);
    };setHighlightValue

    return (
        <div
            onClick={handleClick}
            className={`border w-12 h-12 flex items-center justify-center cursor-pointer font-bold
        ${isSelected ? "bg-blue-300" : ""}
        ${isHighlighted ? "bg-yellow-200" : ""}
        ${!isSelected && isInFocus ? "bg-gray-200" : ""}
        ${!isSelected && !isHighlighted && !isInFocus ? "hover:bg-gray-50" : ""}`}
        >
            {value || ''}
        </div>
    );
}

