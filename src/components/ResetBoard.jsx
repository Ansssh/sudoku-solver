export default function ResetBoard(props){
    return (
        <>
            <button className="flex items-center justify-center gap-1 w-30 h-10 font-bold bg-white rounded-full shadow-xl hover:ring" onClick={() => props.setBoard(props.emptyBoard)}>Clear All</button>
        </>
    )
}