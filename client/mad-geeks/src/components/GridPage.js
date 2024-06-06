import '../assets/css/grid.css';
import { AsideMenu } from './AsideMenu';
import {useState} from 'react'
import { DraggableToken } from './DraggableToken';
import { DraggableTokenManger } from './DraggableTokenManager';
/* 
    manger = [
        {
            <cell_id:> {
                tk: {
                    <id>: status,
                    <id>: status,
                    <id>: status,
                    ...
                }
            }, ...
        },
        {
            <token_id>: {
                current: <cell_id>,
                history: [<cell_id>]
            }, ...
        }
    ]

*/

// default values
var width = 3;
var height = 3;


// generate key for column
const convertToAlpha = (n) => { 
    //limit max map size
    if (n > 400) {
        n = 400;
    }
    let index = 0;
    let result = "";
    if (n == 0)
        return 'A';
    while (n > 0) {
        result += String.fromCharCode(((n % 26) - 1) + 66);
        n = Math.floor(n/26) ;
    }
    return Array.from(result).reverse().join('');
}

const createHeaders = (w = width, h = height) => {
    var cell_headers = [];

    let i = 0;
    let j = 0;

    for (i = 0; i < w; i++) {
        var col = convertToAlpha(i);
        for (j = 1; j <= h; j++) {
            cell_headers.push({ id: col + ":" + j })
        }
    }
    return cell_headers;
}


// fallback function 
const _fallBackInit = (width = 3, height = 3) => {
    let i = 0; 
    let initState = [{}, {}]
    console.log("this should only run once");
    const headers = createHeaders(width, height);
    const n = headers.length;
    for (i = 0; i < n; i++){
        const cell_id = headers[i]['id'];
        initState[0][cell_id] = {}
    }
    return initState;
}

export function GridPage({ initializeGrid = _fallBackInit, cell_headers = createHeaders(width, height) }) {
    const [data, setData] = useState(initializeGrid);
    console.log("Data: ", data);

    const handleDrop = (e) => {
        e.preventDefault()
        const cell_id = e.currentTarget.id;
        const dropped_token = e.dataTransfer.getData("text");

        if (dropped_token.trim() === '') {
            return;
        }
        console.log("Dropping: " + dropped_token + " at " + cell_id);

        // attempt to addToken here...
        if (cell_id in data[0]) {
            console.log("adding a token to avaliable cell...");
            var newToken = false;
            if (!(dropped_token in data[1])) {
                console.log("new token detected")
                newToken = true;
            }
            else if (data[1][dropped_token]['current'] === cell_id) {
                console.log('Token did not move positions on drag and drop');
                return;
            }
            if (!newToken) {
                const lastPos = data[1][dropped_token]['history'][data[1][dropped_token]['history'].length - 1];
          
                setData((prev) => {
             
                    const updatedList = Object.fromEntries(Object.entries(prev[0]).reduce((acc, [cell, obj], index) => {
                        // token dropped at location
                        if (cell === cell_id) {
                            console.log('uwu');
                            return [...acc, [cell, { ...obj, [dropped_token]: true }]];
                        }
                        // remove the token at the previous location
                        if (cell === lastPos) {
                            let copy = { ...obj }
                            delete copy[dropped_token]
                            return [...acc, [cell, { ...copy }]];
                        }
                        // unaffected cell
                        else {
                            console.log('item moved!')
                            return [...acc, [cell, { ...obj }]];
                        }
                        
                    }, []));

                    const copyList = { ...prev[1] };
                    copyList[dropped_token]['current'] = cell_id;
                    copyList[dropped_token]['history'].push(cell_id);
                    return [updatedList, copyList];
                })
                
            }
            else {
                setData((prevValue) => {
                    return prevValue.map((obj, index) => {
                        // insert/update new object value here
                        if (index === 0 && obj) {
                            return {
                                ...obj, [cell_id]: {
                                    ...obj.cell_id,
                                    [dropped_token]: true
                                }
                            }
                        }
   
                        return {
                            ...obj, [dropped_token]: {
                                'current': cell_id,
                                'history': [cell_id]
                            }
                        }

                    
                    })
                })
            }}
        }
        const numColumns = {
            gridTemplateColumns: `repeat(${width}, 0fr)`,
            gridTemplateRows: `repeat(${height}, 0fr)`
        };

    
        const gridItems = cell_headers.map((e) => {
            const tk = Object.keys(data[0][e.id]).map((a) => {
                return (
                    <DraggableToken id={a} key={a} dropEffect='move' style="tk-grid" />
                )
            })
       
            return (<div className='grid-item flex centered' style={{ position: "relative" }} id={e.id} key={e.id}
                onDragOver={(e) => {
                    e.preventDefault()
                    console.log(e.currentTarget.id);
                }}
                onDrop={(handleDrop)}
            >
                {tk}
            </div>)
        });
    

        return (
            <div className="flex flex-row flex-full">
                <div className="grid flex-main center" style={numColumns} >
                    {gridItems}
                </div>
                <AsideMenu />
            </div>
        );
    }

