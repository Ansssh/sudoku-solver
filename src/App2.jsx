import { useState } from 'react';
import Button from './components/Button';
import Numbers from './components/InputNumbers';
import Board from './components/Board';
import ResetBoard from './components/ResetBoard';

function App() {
    const emptyBoard = Array(9).fill(0).map(() => Array(9).fill(''));
    // const tempBoard = [
    //     ['', '', '', '', '5', '', '', '9', '4'],
    //     ['8', '', '9', '', '', '', '', '', '5'],
    //     ['', '7', '', '', '', '9', '8', '', '2'],
    //     ['2', '', '', '1', '', '', '', '', ''],
    //     ['', '4', '5', '', '', '', '6', '8', ''],
    //     ['', '', '', '', '', '7', '', '', '9'],
    //     ['9', '', '8', '2', '', '', '', '1', ''],
    //     ['6', '', '', '', '', '', '2', '', '8'],
    //     ['4', '5', '', '', '6', '', '', '', '']
    // ]
    // const [board, setBoard] = useState(tempBoard);
    const [board, setBoard] = useState(emptyBoard);
    const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
    const [viewNumbers, setviewNumbers] = useState(false);
    const [highlightValue, setHighlightValue] = useState(null);
    const [showSolve, setShowSolve] = useState(false); // show Solve button after Save
    const [solving, setSolving] = useState(false); // hide Edit/Save during solving
    const [solveDescription, setSolveDescription] = useState(""); // show description under board
    const [stepReady, setStepReady] = useState(false); // enable Solve Next after Solve
    const [stepState, setStepState] = useState(null); // store current step state

    const handleNumberClick = (num) => {
        const { row, col } = selectedCell;
        if (row !== null && col !== null) {
            const value = (num && ['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(num.toString())) ? num.toString() : '';
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
                if (val === '') continue;
                const rowKey = `row-${r}-${val}`;
                const colKey = `col-${c}-${val}`;
                const boxKey = `box-${Math.floor(r / 3)}-${Math.floor(c / 3)}-${val}`;
                if (seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey)) return false;
                seen.add(rowKey);
                seen.add(colKey);
                seen.add(boxKey);
            }
        }
        return true;
    };

    const getPossibleValues = (brd, row, col) => {
        if (brd[row][col] !== '') return [];
        const possible = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
        for (let i = 0; i < 9; i++) {
            if (typeof brd[row][i] === 'string') possible.delete(brd[row][i]); // row
            if (typeof brd[i][col] === 'string') possible.delete(brd[i][col]); // column
        }
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (typeof brd[boxRow + i][boxCol + j] === 'string') possible.delete(brd[boxRow + i][boxCol + j]);
            }
        }
        return [...possible];
    };

    // Returns {board, selectedCell, highlightValue, message} or null if no move
    const explainableSolveStep = (currentBoard) => {
        const newBoard = currentBoard.map(r => [...r]);
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
        // 2. Hidden Singles — Rows
        for (let r = 0; r < 9; r++) {
            const cellOptions = Array(9).fill().map((_, c) => getPossibleValues(newBoard, r, c));
            for (let num = 1; num <= 9; num++) {
                const candidates = [];
                for (let c = 0; c < 9; c++) {
                    if (newBoard[r][c] === '' && cellOptions[c].includes(num.toString())) {
                        candidates.push(c);
                    }
                }
                if (candidates.length === 1) {
                    const col = candidates[0];
                    newBoard[r][col] = num.toString();
                    return {
                        board: newBoard,
                        selectedCell: { row: r, col },
                        highlightValue: num.toString(),
                        message: `Row ${r + 1}: Only cell [${r + 1}, ${col + 1}] can be '${num}' — Hidden Single.`
                    };
                }
            }
        }
        // 3. Hidden Singles — Columns
        for (let c = 0; c < 9; c++) {
            const cellOptions = Array(9).fill().map((_, r) => getPossibleValues(newBoard, r, c));
            for (let num = 1; num <= 9; num++) {
                const candidates = [];
                for (let r = 0; r < 9; r++) {
                    if (newBoard[r][c] === '' && cellOptions[r].includes(num.toString())) {
                        candidates.push(r);
                    }
                }
                if (candidates.length === 1) {
                    const row = candidates[0];
                    newBoard[row][c] = num.toString();
                    return {
                        board: newBoard,
                        selectedCell: { row, col: c },
                        highlightValue: num.toString(),
                        message: `Column ${c + 1}: Only cell [${row + 1}, ${c + 1}] can be '${num}' — Hidden Single.`
                    };
                }
            }
        }
        // 4. Hidden Singles — Boxes
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                const candidatesMap = {};
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const r = boxRow * 3 + i;
                        const c = boxCol * 3 + j;
                        if (newBoard[r][c] === '') {
                            const options = getPossibleValues(newBoard, r, c);
                            options.forEach(val => {
                                if (!candidatesMap[val]) candidatesMap[val] = [];
                                candidatesMap[val].push([r, c]);
                            });
                        }
                    }
                }
                for (let num = 1; num <= 9; num++) {
                    const key = num.toString();
                    if (candidatesMap[key]?.length === 1) {
                        const [r, c] = candidatesMap[key][0];
                        newBoard[r][c] = key;
                        return {
                            board: newBoard,
                            selectedCell: { row: r, col: c },
                            highlightValue: key,
                            message: `Box [${boxRow + 1}, ${boxCol + 1}]: Only cell [${r + 1}, ${c + 1}] can be '${key}' — Hidden Single.`
                        };
                    }
                }
            }
        }
        return null;
    };

    const solveNextStep = () => {
        let currentBoard = stepState ? stepState.board : board;
        const stepResult = explainableSolveStep(currentBoard);
        if (stepResult) {
            setBoard(stepResult.board);
            setSelectedCell(stepResult.selectedCell);
            setHighlightValue(stepResult.highlightValue);
            setSolveDescription(stepResult.message);
            setStepState({ board: stepResult.board });
        } else {
            setSolveDescription("Done! Either puzzle is complete or logic-based solving is exhausted.");
            setStepReady(false);
        }
    };

    const startSolving = () => {
        setSolving(true);
        setSolveDescription("");
        setStepReady(true);
        setStepState({ board });
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
            {viewNumbers && !solving && (
                <Numbers onNumberClick={handleNumberClick} />
            )}
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
                    className={`flex items-center justify-center gap-1 w-48 h-10 font-bold rounded-full shadow-xl hover:ring 
                ${countFilledCells() < 7 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                >
                    Solve
                </button>
            )}
            {stepReady && solving && (
                <button
                    onClick={solveNextStep}
                    className="flex items-center justify-center gap-1 w-48 h-10 font-bold rounded-full shadow-xl hover:ring bg-white mt-2"
                >
                    Solve Next
                </button>
            )}
            
        </div>
    );
}

export default App;
