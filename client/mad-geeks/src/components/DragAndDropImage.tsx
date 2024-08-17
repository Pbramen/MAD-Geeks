import { useRef, useState, Dispatch, SetStateAction } from "react";

const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
type DragParameters = {
    state: string,
    setState: React.Dispatch<SetStateAction<string>>
}
export const DragAndDropImage = ({state, setState, style}) => {
    const [dragState, setDragState] = useState(true);
    const [imageErrors, setImageErrors] = useState('')


    const validatefile = (file: File) => {
        if (validTypes.includes(file.type)) {
            // check if size is valid 
            if (file.size > (1024 * 1024  * 5)) {
                return 'File size exceeded 5M!';
            }
            return 'ok';
        }
        else {
            return "Invalid file type";
            
        }
    }

    const pasteImageDriver = (file: File) => {
        const result = validatefile(file);
        if (result !== 'ok') {
            setImageErrors(result);
            return;
        }
        // validation has passed! we can now store it in the state.
        const fileReader = new FileReader();
        console.log("HOTTOGO")
        
        // define callback functions 
        fileReader.onload = () => {
            const fileURL = fileReader.result;
            console.log(fileURL);
            setState(fileURL.toString());
        }
        fileReader.onerror = () => {
            setImageErrors("Unexpected error has occured.");
        }

        fileReader.readAsDataURL(file);

    }

    
    const dropHandler = (e: React.DragEvent) => {
        e.preventDefault();
        setImageErrors('');
        // handles different bowser support
        if (e.dataTransfer.items) {
            // deconstruct the array -> prevents crashing (reason TDB)
            [...e.dataTransfer.items].forEach((item, index) => {
                const file = item.getAsFile();
                pasteImageDriver(file);
            })
        }
        else if (e.dataTransfer.files) {
            [...e.dataTransfer.files].forEach((file, index) => {
                pasteImageDriver(file);
            })
        }
    }
    const dragOverHandler = (e: React.DragEvent ) => {
        e.preventDefault();
        setDragState(false);
    }   

    const dragEndHandler = (e: React.DragEvent) => {
        e.preventDefault();
        setDragState(true);
    }

    const removeImage = () => {
        setState("");
        setDragState(true);
    }
    return (
        <div className="flex flex-column profile-wrapper">
            
            {state ?
                <>
                    <img className='profile-pic' src={state}  {...style}/>
                    <button type="button" className="btn-1" onClick={removeImage}>Remove Image</button>
                </>
                :
                <span className={`flex flex-column drag-image-area ${!dragState ? 'active-section' : ''}`} {...style} onDrop={dropHandler} onDragOver={dragOverHandler} onDragLeave={dragEndHandler}>
                {dragState ? <span >Drag & Drop your character's image/artwork here or<span className="upload-btn">browse for file</span></span> :
                    <span>Release to upload file</span>
                }
                <span className="desc-img-req">Supports .jpeg, .png files only. Limit to size 5MB (recommended: 500x500 pixels)</span>
            </span>}
            {imageErrors && <span>{ imageErrors }</span>}
        </div>
    )
}