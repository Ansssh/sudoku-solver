import { useState } from 'react'
import Button from './components/Button'
import Numbers from './components/InputNumbers'

function App() {
    const [viewNumbers, setviewNumbers] = useState(false);

    return (
        <div className='w-screen h-screen flex items-center justify-center gap-4 flex-col'>

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
