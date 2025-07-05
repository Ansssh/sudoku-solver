import { useState } from 'react';
import Button from './components/Button';
import Numbers from './components/InputNumbers';
import Board from './components/Board';
import ResetBoard from './components/ResetBoard';

function App() {
    const emptyBoard = Array(9).fill(0).map(() => Array(9).fill(''));
    const tempBoard = [
        ['', '', '', '', '5', '', '', '9', '4'],
        ['8', '', '9', '', '', '', '', '', '5'],
        ['', '7', '', '', '', '9', '8', '', '2'],
        ['2', '', '', '1', '', '', '', '', ''],
        ['', '4', '5', '', '', '', '6', '8', ''],
        ['', '', '', '', '', '7', '', '', '9'],
        ['9', '', '8', '2', '', '', '', '1', ''],
        ['6', '', '', '', '', '', '2', '', '8'],
        ['4', '5', '', '', '6', '', '', '', '']
    ]
    const [board, setBoard] = useState(tempBoard);
    // const [board, setBoard] = useState(emptyBoard);
    const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
    const [viewNumbers, setviewNumbers] = useState(false);
    const [highlightValue, setHighlightValue] = useState(null);
    const [showSolve, setShowSolve] = useState(false);
    const [solving, setSolving] = useState(false);
    const [solveDescription, setSolveDescription] = useState("");
    const [stepReady, setStepReady] = useState(false);
    const [stepState, setStepState] = useState(null);
    const [solved, setSolved] = useState(false);

    const handleNumberClick = (num) => {
        const { row, col } = selectedCell;
        if (row !== null && col !== null) {
            const value = (['1','2','3','4','5','6','7','8','9'].includes(num?.toString())) ? num.toString() : '';
            const newBoard = board.map(r => [...r]);
            newBoard[row][col] = value;
            if (isValidBoard(newBoard)) {
                setBoard(newBoard);
            } else {
                alert("Invalid move! This breaks Sudoku rules.");
            }
        }
    };

    const countFilledCells = () => board.flat().filter(cell => cell !== '').length;

    const isValidBoard = (brd) => {
        const seen = new Set();
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const val = brd[r][c];
                if (!val) continue;
                const rowKey = `r-${r}-${val}`, colKey = `c-${c}-${val}`, boxKey = `b-${Math.floor(r / 3)}-${Math.floor(c / 3)}-${val}`;
                if (seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey)) return false;
                seen.add(rowKey); seen.add(colKey); seen.add(boxKey);
            }
        }
        return true;
    };

    const getPossibleValues = (brd, row, col) => {
        if (brd[row][col] !== '') return [];
        const possible = new Set(['1','2','3','4','5','6','7','8','9']);
        for (let i = 0; i < 9; i++) {
            possible.delete(brd[row][i]);
            possible.delete(brd[i][col]);
        }
        const boxRow = Math.floor(row / 3) * 3, boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                possible.delete(brd[boxRow + i][boxCol + j]);
            }
        }
        return [...possible];
    };

    const explainableSolveStep = (brd) => {
        const newBoard = brd.map(r => [...r]);

        // 1. Naked Singles
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (newBoard[r][c] === '') {
                    const possible = getPossibleValues(newBoard, r, c);
                    if (possible.length === 1) {
                        const value = possible[0];
                        newBoard[r][c] = value;
                        return {
                            board: newBoard,
                            selectedCell: { row: r, col: c },
                            highlightValue: value,
                            message: `Cell [${r + 1}, ${c + 1}] can only be '${value}' — Naked Single.`
                        };
                    }
                }
            }
        }

        // 2. Hidden Singles — Rows, Columns, Boxes
        for (const unit of ['row', 'col', 'box']) {
            for (let idx = 0; idx < 9; idx++) {
                const candidatesMap = {};
                for (let i = 0; i < 9; i++) {
                    let r, c;
                    if (unit === 'row') [r, c] = [idx, i];
                    if (unit === 'col') [r, c] = [i, idx];
                    if (unit === 'box') {
                        const boxRow = Math.floor(idx / 3) * 3;
                        const boxCol = (idx % 3) * 3;
                        r = boxRow + Math.floor(i / 3);
                        c = boxCol + (i % 3);
                    }
                    if (newBoard[r][c] === '') {
                        const options = getPossibleValues(newBoard, r, c);
                        for (const val of options) {
                            if (!candidatesMap[val]) candidatesMap[val] = [];
                            candidatesMap[val].push([r, c]);
                        }
                    }
                }
                for (let num = 1; num <= 9; num++) {
                    const positions = candidatesMap[num.toString()];
                    if (positions?.length === 1) {
                        const [r, c] = positions[0];
                        newBoard[r][c] = num.toString();
                        return {
                            board: newBoard,
                            selectedCell: { row: r, col: c },
                            highlightValue: num.toString(),
                            message: `${unit[0].toUpperCase() + unit.slice(1)} ${idx + 1}: Only cell [${r + 1}, ${c + 1}] can be '${num}' — Hidden Single.`
                        };
                    }
                }
            }
        }

        return null;
    };

    const solveNextStep = () => {
        const current = stepState ? stepState.board : board;
        const step = explainableSolveStep(current);
        if (step) {
            setBoard(step.board);
            setSelectedCell(step.selectedCell);
            setHighlightValue(step.highlightValue);
            setSolveDescription(step.message);
            setStepState({ board: step.board });
        } else {
            setSolveDescription("Puzzle solved or no further logical steps found.");
            setStepReady(false);
            setSolved(true);
        }
    };

    const startSolving = () => {
        setSolving(true);
        setStepReady(true);
        setStepState({ board });
        setSolveDescription("");
        setSolved(false);
    };

    const resetToHome = () => {
        setBoard(emptyBoard);
        setSelectedCell({ row: null, col: null });
        setviewNumbers(false);
        setHighlightValue(null);
        setShowSolve(false);
        setSolving(false);
        setSolveDescription("");
        setStepReady(false);
        setStepState(null);
        setSolved(false);
    };

    return (
        <div className='w-screen h-screen flex items-center justify-center gap-4 flex-col'>
            <Board
                board={board}
                setSelectedCell={setSelectedCell}
                selectedCell={selectedCell}
                highlightValue={highlightValue}
                setHighlightValue={setHighlightValue}
            />
            {solveDescription && <div className="mt-2 text-center text-green-700 font-semibold">{solveDescription}</div>}
            {viewNumbers && !solving && <Numbers onNumberClick={handleNumberClick} />}
            {viewNumbers && !solving ? (
                <div className='flex gap-3'>
                    <ResetBoard emptyBoard={emptyBoard} setBoard={setBoard} />
                    <Button text="Save" seal="ri-bookmark-fill" viewNumbers={viewNumbers} setviewNumbers={(v) => { setviewNumbers(v); setShowSolve(true); }} />
                </div>
            ) : !viewNumbers && !solving ? (
                <Button text="Edit" seal="ri-pencil-fill" viewNumbers={viewNumbers} setviewNumbers={setviewNumbers} />
            ) : null}

            {showSolve && !viewNumbers && !solving && (
                <button
                    disabled={countFilledCells() < 7}
                    onClick={startSolving}
                    className={`w-48 h-10 font-bold rounded-full shadow-xl hover:ring ${countFilledCells() < 7 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                >
                    Solve
                </button>
            )}

            {stepReady && solving && !solved && (
                <button
                    onClick={solveNextStep}
                    className="w-48 h-10 font-bold rounded-full shadow-xl hover:ring bg-white mt-2"
                >
                    Solve Next
                </button>
            )}

            {solved && (
                <button
                    onClick={resetToHome}
                    className="w-48 h-10 font-bold rounded-full shadow-xl hover:ring bg-green-100 text-green-700 mt-2"
                >
                    Go Home
                </button>
            )}
        </div>
    );
}

export default App;
