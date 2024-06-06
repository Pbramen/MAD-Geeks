import { dragStart } from "../assets/js/eventHandler.js";
import { useRef, useState } from 'react';

export function DraggableToken({ id = '1', dropEffect = 'copy', style = "" }) {

    const handleDrag = (e) => {
        if (e.target.id !== '') {
            e.dataTransfer.setData('text', id);
            console.log("Grabbing: " + e.dataTransfer.getData('text'));
            e.dataTransfer.dropEffect = dropEffect;
        }
        else {
            console.log("invalid draggable object");
        }
    }

    const handleDragEnd = (e) => {
        console.log("dragEnded");
    }
    
    return (
        <div className={`dot ${style}` } draggable id={id}
            onDragStart={handleDrag}
        >
            <span>{id}</span>
        </div>
    )
}