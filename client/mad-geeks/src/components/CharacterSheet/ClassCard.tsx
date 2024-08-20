import React, { useState, useEffect } from 'react';
import { class_data, Resource_Pool } from 'assets/dndClassByLevel';
import { FieldSet } from "components/FieldSet";

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

export function ClassCard<T>({ control, errors, sheetError, classState, dispatch}  ){
    const [activeItem, setActiveItem] = useState('barbarian');
    
    useEffect(() => {
        console.log(activeItem)
    }, [activeItem])
    const selectItem = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const target = e.target as HTMLDivElement;
        console.log(target);
        setActiveItem(target.id || target.getAttribute('data-id'));
    }

    const highlightChange = (e) => {
        const target = e.target as HTMLSpanElement; 
        console.log('this element was changed externally!')
        
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
        const level = classState[activeItem] || 0; 
        const resource = e?.pool?.[level];
        return (
            <FieldSet key={index} state="" path="" legend_title={e.name} description={e.description}>
                <DisplayQuantity resource={resource}/>
            </FieldSet>
        )
    })
    

        return (
            <div className="res-flex-res" >

                <div className='flex flex-column vert-tab-simple'>
                    <span>Select your class(es):</span>
                    {navList}
                </div>
                <div className='flex flex-column' style={{flex: "1 0 70%"}}>
                    <div className="flex flex-column" style={{ justifyContent: 'center', alignItems: 'center', marginBottom: '50px'}}>
                        <h2 className="header-2">{activeItem[0].toUpperCase() + activeItem.slice(1)}</h2>
                        <div className="circle">
                            <img src={class_data[activeItem]?.img} alt={activeItem + ' icon'} width={100} height={100} />       
                        </div>
                        <span className="small-descript">{class_data[activeItem]?.description || "Unable to load description."}</span>

                        <div className="flex flex-row" style={{marginTop:"30px", maxWidth: '300px'}}>           
                            <label htmlFor='classLevel' >Level(s):</label>
                            <input
                                id="classLevel"
                                type='number'
                                min={0}
                                max={20}
                                value={classState[activeItem]}
                                onChange={e => dispatch(prev => {return{...prev, [activeItem]: e.target.value}})}    
                            />
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