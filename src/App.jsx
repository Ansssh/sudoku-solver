import { useState } from 'react'
import Button from './components/Button'
import Numbers from './components/InputNumbers'
import Board from './components/Board';

function App() {
    const emptyBoard = Array(9).fill(0).map(() => Array(9).fill(''));
    const [board, setBoard] = useState(emptyBoard);
    const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
    const [viewNumbers, setviewNumbers] = useState(false);

    return (
        <div className='w-screen h-screen flex items-center justify-center gap-4 flex-col'>
            <Board
                board={board}
                setSelectedCell={setSelectedCell}
                selectedCell={selectedCell}
            />
            {viewNumbers && <Numbers/>}
            {viewNumbers ?
                <div className='flex gap-3'>
                    <Button text="Save" seal="ri-bookmark-fill" viewNumbers={viewNumbers} setviewNumbers={setviewNumbers} />
                </div>
                :
                <Button text="Edit" seal="ri-pencil-fill" viewNumbers={viewNumbers} setviewNumbers={setviewNumbers} />
            }


        </div>
    );
}

export default App;
