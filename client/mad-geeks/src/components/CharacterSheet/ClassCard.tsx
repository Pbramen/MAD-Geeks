import React, { useState, useRef, useEffect } from 'react';
import { class_data, Resource_Pool } from 'assets/dndModel';
import { FieldSet } from "components/FieldSet";
import { ArrowsInput } from 'components/CustomInput';

// displays information regarding quantity/quality of class feature!
function DisplayQuantity({resource} : {resource: Resource_Pool}) {
    return (
    <>
        {resource && (
                <div className="flex flex-row" style={{
                    position: 'absolute', 
                    bottom: '10px',
                    right: '10px'
                }}>
                    {resource.quantity && <span className="highlight-resource">Uses: <strong>{resource.quantity}</strong> </span> }
                    {resource.bonus && <span className="highlight-resource">Bonuses: <strong>{resource.bonus}</strong> </span>}
                    {resource.die_roll && <span className="highlight-resource">Die Roll: <strong>{resource.die_roll}</strong></span>}
                </div>  
            ) 
        }
    </>
    )
}

function LimitRadioList({ checkState, setCheckState, selectOptions, level }) {
    const quantity = selectOptions.quantity[level] || 0;
    const array = Array.from({ length: selectOptions.options.length }, () => false);
    // const [checkState, setCheckState] = useState(array);
    const totalChecked = checkState.reduce((acc, curr) => {
        const a = curr ? 1 : 0;
        return acc += a;
    }, 0);

    const handleCheckedChange = (e, index) => {
        // check if total amount exceeds quantity
        if (!checkState[index] && totalChecked >= quantity) {
            return;
        }
        // set the state to its opposite 
        else {
            // set the state
            setCheckState(prev => prev.map((e, i) => { 
                return i === index ? !e : e;
            }))
        }
    }
    const list = selectOptions.options.map((e, index) => {
        
        return (
            <div>
                <input id={e.id} type="checkbox" className={quantity > totalChecked ? "active-box": "disabled-box"} />
                <label htmlFor={e.id}>{e.id}</label>
                <div>{e.descript}</div>
            </div>
        )
    })
    console.log(list);
    return (
        <>
            {list}  
        </>
    )
}
export function ClassCard({ control, errors, sheetError, classState, dispatch}  ){
    const [activeItem, setActiveItem] = useState('barbarian');
   
    useEffect(() => {
       
        console.log("page loaded...")
    }, [])
    
    const selectItem = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const target = e.target as HTMLDivElement;
        setActiveItem(target.id || target.getAttribute('data-id'));
    }

    const navList = Object.entries(class_data).map(([key, value], index) => {
        return (
            <div key={index} id={key} className={`${activeItem === key && 'active-list-tab'} list-tab ${classState[key] > 0? 'set-tab': 'border-left'}`} onClick={selectItem}>
                <span data-id={key} >{key[0].toUpperCase() + key.slice(1)}</span>
            </div>
        )
    })

    const displayFeaturesByLevel = class_data[activeItem].resources.class_features.filter(e => {
        return e.unlockedBy <= classState[activeItem];
    }).map((e, index) => {
        const level = (classState[activeItem] - 1) > 0 ? (classState[activeItem] - 1) : 0; 
        const resource = e?.pool?.[level];
        
        return (
            <FieldSet key={index} state="" path="" legend_title={e.name} description={e.description}>
                <DisplayQuantity resource={resource} />
            </FieldSet>
        )
    })
    
    const onClickHandler = (e: React.MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        if (target.name === 'subtract' && classState[activeItem] > 0) {
            dispatch(prev => {return {...prev, [activeItem]: prev[activeItem] ? prev[activeItem] -= 1 : 1}});
        }
        else if (target.name === 'add'){
            if (classState[activeItem] <= 19)
                dispatch(prev => {return {...prev, [activeItem]: prev[activeItem] ? prev[activeItem] += 1 : 1}});
        }
        return;
    }
        return (
            <div className="res-flex-res" >

                <div className='flex flex-column vert-tab-simple'>
                    <span>Select your class(es):</span>
                    {navList}
                </div>
                <div className='flex flex-column form-section' style={{ flex: "1 0 70%", padding: '20px', border: '2px solid  rgb(8, 20, 53)', borderRadius:'30px', boxShadow: "20px 20px rgb(8, 20, 53)"}}>
                    <div className="flex flex-column" style={{ justifyContent: 'center', alignItems: 'center', marginBottom: '50px'}}>
                        <h2 className="header-2">{activeItem[0].toUpperCase() + activeItem.slice(1)}</h2>
                        <div className="circle">
                            <img src={class_data[activeItem]?.img} alt={activeItem + ' icon'} width={100} height={100} />       
                        </div>
                        <span className="small-descript">{class_data[activeItem]?.description || "Unable to load description."}</span>

                        <div className="flex flex-row" style={{marginTop:"30px", maxWidth: '300px'}}>           
                            <label htmlFor='classLevel_value' >Level(s):</label>

                            <ArrowsInput identity="classLevel" onClickHandler={onClickHandler} >
                                {classState[activeItem].toString()}
                            </ArrowsInput>
                        </div>
                    </div>
                    
                    {classState[activeItem] > 0 && <h2>Overview of Ability Features: </h2>}
                    <div className="res-2-2">
                        {displayFeaturesByLevel}
                    </div>   
                </div>
                
            </div>
        )    
}