import { useRef, useState } from "react"
import { dragOver, dragDropped } from '../assets/js/eventHandler.js';
import { DraggableToken } from "./DraggableToken.js";


export function GridCell({id, distance = 5 }) {
    const weight = useRef(distance)
    const [tokens, setTokens] = useState({})

    const copyToken = (e) => {
        const data = dragDropped(e);
        
        setTokens((prevState) => {
            if (prevState[data]) {
                return tokens;
            }
            return {...tokens, [data]:true}
        })
        console.log(tokens);
    }


    return (
        <div onClick={()=>{console.log("clicked")}} id={id} className='grid-item flex centered'
            draggable={false}
            onDragOver={(e) => dragOver(e)}
            onDrop={(e)=>{copyToken(e)}}
        >
            {Object.keys(tokens).map((e) => {
                console.log(e);
                return (
                    
                    <DraggableToken id={e} key={e} setState={setTokens} state={tokens}/>
                )   
            })}
       </div>
   ) 
}