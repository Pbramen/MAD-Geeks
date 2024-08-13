import React, { useState, useContext, useRef } from 'react';

type ClassCard<T> = {
    data: {
        id: string,
        name: string,
        img: string
    },
    register: any,
}
export function ClassCard<T>({ data, register}: ClassCard<T> ){
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const img_id = data.id + '_img';
    const class_id = data.id;

    // const changeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const target = e.currentTarget;
    //     setPayload(prev => {
    //         return {
    //             ...prev, classes: {
    //                 ...prev.classes, SRD: {
    //                     ...prev.classes.SRD, [target.name]: target.value
    //                 }
    //             }
    //         }
    //     })
    // }
        return (
            <div className="flex flex-column centered" style={{ marginBottom: "65px" }}>
                {/* <img width="75px" height="75px" className={'class-icon collapsed centered'} src={data.img} id={img_id} alt={`Icon image for ${data.name} class.`} />
                <label htmlFor={class_id}>{data.name}</label>
                <div className="flex flex-row">

                    <input {...register(class_id, {
                        valueAsNumber: true,
                        min: {
                            value: 0,
                            message: "Value cannot be less than 0!"
                        }
                    })} id={class_id} name={class_id} type="number" className="sm-input"
                        value={ payload?.classes?.SRD[class_id]} />
        
                
                </div> */}
            </div>
        )    
}