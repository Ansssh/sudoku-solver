import { useState } from 'react'
import Button from './components/Button'
import Numbers from './components/InputNumbers'
import Board from './components/Board';
import ResetBoard from './components/ResetBoard'

function App() {
    const emptyBoard = Array(9).fill(0).map(() => Array(9).fill(''));
    const [board, setBoard] = useState(emptyBoard);
    const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
    const [viewNumbers, setviewNumbers] = useState(false);

    const handleNumberClick = (num) => {
        const { row, col } = selectedCell;
        if (row !== null && col !== null) {
            const newBoard = board.map(r => [...r]); // deep copy
            newBoard[row][col] = num || ''; // eraser passes `undefined`
            if (isValidBoard(newBoard)) {
                setBoard(newBoard);
            } else {
                alert("Invalid move! This breaks Sudoku rules.");
            }
        }
    };


    const countFilledCells = () => {
        return board.flat().filter(cell => cell !== '').length;
    };

    const isValidBoard = (brd) => {
        const seen = new Set();

        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const val = brd[r][c];
                if (val === '') continue;

                const rowKey = `row-${r}-${val}`;
                const colKey = `col-${c}-${val}`;
                const boxKey = `box-${Math.floor(r / 3)}-${Math.floor(c / 3)}-${val}`;

                if (seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey)) {
                    return false; // Invalid placement
                }

                seen.add(rowKey);
                seen.add(colKey);
                seen.add(boxKey);
            }
        }

        return true;
    };


    return (
        <div className='w-screen h-screen flex items-center justify-center gap-4 flex-col'>
            <Board
                board={board}
                setSelectedCell={setSelectedCell}
                selectedCell={selectedCell}
            />
            {viewNumbers && <Numbers onNumberClick={handleNumberClick} />}
            {viewNumbers ?
                <div className='flex gap-3'>
                    <ResetBoard emptyBoard={emptyBoard} setBoard={setBoard}></ResetBoard>
                    <Button text="Save" seal="ri-bookmark-fill" viewNumbers={viewNumbers} setviewNumbers={setviewNumbers} />
                </div>
                :
                <Button text="Edit" seal="ri-pencil-fill" viewNumbers={viewNumbers} setviewNumbers={setviewNumbers} />
            }

            <button
                disabled={countFilledCells() < 17}
                onClick={() => console.log("Solve clicked")}
                className={`flex items-center justify-center gap-1 w-30 h-10 font-bold rounded-full shadow-xl hover:ring ${countFilledCells() < 17 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white"}`}
            >
                Solve
            </button>

        </div>
    );
}

export default App;
