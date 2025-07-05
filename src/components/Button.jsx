export default function Button(props){

    return (
        <>
            <button onClick={()=>{props.setviewNumbers(!props.viewNumbers)}} className="flex items-center justify-center gap-1 w-30 h-10 font-bold bg-white rounded-full shadow-xl hover:ring"><i class={props.seal}></i>{props.text}</button>
        </>
    )
}   
