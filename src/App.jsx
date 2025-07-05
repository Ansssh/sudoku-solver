import { useState } from 'react';
import Button from './components/Button';
import Numbers from './components/InputNumbers';
import Board from './components/Board';
import ResetBoard from './components/ResetBoard';

function App() {
  const generateEmptyBoard = () => Array(9).fill(null).map(() => Array(9).fill(''));
  const [board, setBoard] = useState(generateEmptyBoard());
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [viewNumbers, setviewNumbers] = useState(false);
  const [highlightValue, setHighlightValue] = useState(null);

  const isValidBoard = (brd) => {
    const seen = new Set();
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = brd[r][c];
        if (val === '') continue;
        const rowKey = `r${r}-${val}`;
        const colKey = `c${c}-${val}`;
        const boxKey = `b${Math.floor(r / 3)}${Math.floor(c / 3)}-${val}`;
        if (seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey)) return false;
        seen.add(rowKey);
        seen.add(colKey);
        seen.add(boxKey);
      }
    }
    return true;
  };

  const countFilledCells = () => board.flat().filter(cell => cell !== '').length;

  const getPossibleValues = (brd, row, col) => {
    if (brd[row][col] !== '') return [];
    const possible = new Set(['1','2','3','4','5','6','7','8','9']);
    for (let i = 0; i < 9; i++) {
      possible.delete(brd[row][i]);
      possible.delete(brd[i][col]);
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        possible.delete(brd[boxRow + i][boxCol + j]);
      }
    }
    return [...possible];
  };

  const findNextSolvableCell = (brd) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (brd[r][c] === '') {
          const possible = getPossibleValues(brd, r, c);
          if (possible.length === 1) {
            return { row: r, col: c, value: possible[0] };
          }
        }
      }
    }
    return null;
  };

  const handleNumberClick = (num) => {
    const { row, col } = selectedCell;
    if (row !== null && col !== null) {
      const value = (num && ['1','2','3','4','5','6','7','8','9'].includes(num.toString())) ? num.toString() : '';
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = value;
      if (isValidBoard(newBoard)) {
        setBoard(newBoard);
        setHighlightValue(value);
      } else {
        alert("Invalid move! This breaks Sudoku rules.");
      }
    }
  };

  const solveNextStep = () => {
    if (!isValidBoard(board)) {
      alert("Current board is invalid. Please fix it first.");
      return;
    }
    const result = findNextSolvableCell(board);
    if (result) {
      const newBoard = board.map(r => [...r]);
      newBoard[result.row][result.col] = result.value;
      setBoard(newBoard);
      setSelectedCell({ row: result.row, col: result.col });
      setHighlightValue(result.value);
    } else {
      alert("No obvious next step found. Try solving manually or use full solver.");
    }
  };

  const resetBoard = () => {
    setBoard(generateEmptyBoard());
    setSelectedCell({ row: null, col: null });
    setHighlightValue(null);
  };

  return (
    <div className='w-screen h-screen flex items-center justify-center gap-4 flex-col p-2'>
      <Board
        board={board}
        setSelectedCell={setSelectedCell}
        selectedCell={selectedCell}
        highlightValue={highlightValue}
        setHighlightValue={setHighlightValue}
      />

      {viewNumbers && <Numbers onNumberClick={handleNumberClick} />}

      {viewNumbers ? (
        <div className='flex gap-3'>
          <ResetBoard resetBoard={resetBoard} />
          <Button text="Save" seal="ri-bookmark-fill" viewNumbers={viewNumbers} setviewNumbers={setviewNumbers} />
        </div>
      ) : (
        <Button text="Edit" seal="ri-pencil-fill" viewNumbers={viewNumbers} setviewNumbers={setviewNumbers} />
      )}

      <button
        disabled={countFilledCells() < 5}
        onClick={solveNextStep}
        className={`flex items-center justify-center gap-1 w-30 h-10 font-bold rounded-full shadow-xl hover:ring 
        ${countFilledCells() < 17 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white"}`}
      >
        Solve
      </button>
    </div>
  );
}

export default App;
