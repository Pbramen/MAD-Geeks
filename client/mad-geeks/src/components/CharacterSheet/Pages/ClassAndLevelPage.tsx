import { Fragment } from "react/jsx-runtime"
import { FieldSet } from "components/FieldSet"
import { GridCellForm } from "../GridCellForm"
import { useCharacter } from "../useCharacterPayload"
import { ClassCard } from "../ClassCard"

import { usePagination } from "components/Pagination/usePagination"
import React , {useEffect} from "react"

import {DevTool} from '@hookform/devtools'

export const ClassAndLevelPage = ({ disabled }: { disabled: boolean}) => {
    // const { payload, setPayload } = useCharacter();
    // const { current_page, setCurrent_Page, setMax_page } = usePagination();
    
    // const class_list = [
    //     {id: 'fighter', name: "Fighter", img:"/img/helmet.png"},
    //     {id: 'cleric', name: "Cleric", img:"/img/health-shield.png"},
    //     {id: 'rogue', name: "Rogue", img:"/img/dagger.png"},
    //     {id: 'ranger', name: "Ranger", img:"/img/archery.png"},
    //     {id: 'bard', name: "Bard", img:"/img/lute.png"},
    //     {id: 'monk', name: "Monk", img:"/img/punch.png"},
    //     {id: 'paladin', name: "Paladin", img:"/img/paladin.png"},
    //     {id: 'druid', name: "Druid", img:"/img/druid.png"},
    //     {id: 'warlock', name: "Warlock", img:"/img/sceptre.png"},
    //     {id: 'sorcerer', name: "Sorcerer", img: "/img/magic-wand.png" },
    //     { id: 'wizard', name: "Wizard", img: "/img/witch-hat.png" },
    //     { id: 'artificer', name: "Artificer", img: "/img/gears.png" },
    // ];
    // const {
    //     register,
    //     handleSubmit,
    //     setError,
    //     clearErrors,
    //     setFocus,
    //     formState: { errors }, 
    //     control
    // } = useForm<SRD & { "custom_error": string }>({});

    // // if this function runs, then all values are guarneeted to be greater than 0 and integers!
    // const getTotalLevel = (data: SRD) => {
    //     const total_levels = Object.values(data).reduce((acc, current) => {
    //         return (acc += current);
    //     }, 0)
    //     return total_levels; 
    // }

    // const validateLevel = (data: SRD) => {
    //     const result = getTotalLevel(data);
    //     console.log(result);
    //     if (result === 0) {
    //         setError("custom_error", {
    //             type: 'manual',
    //             message: "You must set at least one level!"
    //         })
    //         setFocus("barbarian")
    //     }
    // }
    // const handleChange: SubmitHandler<SRD> = (data: SRD) => {
    //     if (data) {
    //         validateLevel(data);
    //     }
    //     if (Object.keys(errors).length === 0) {
    //         setPayload(prev => {
    //             return {
    //                 ...prev, classes: {
    //                     ...prev.classes, SRD: data
    //                 }
    //             }
    //         })

    //         setMax_page((prev) => prev > current_page + 1 ? prev : current_page + 1);
    //         setCurrent_Page((prev) => prev + 1);
    //         console.log("navigating to the next page!")
    //     }
    // }

    return (
        <Fragment>
            {/* {!disabled &&
                <Fragment>
                    <form className="flex flex-column main-body" onSubmit={handleSubmit(handleChange)} onChange={()=>clearErrors("custom_error")}>
                        
                        <FieldSet legend_title="Class" toggle={true} description="Enter your character's level by class!">
                            {errors?.custom_error && <div className="error-msg"> You must have at least 1 level in a class (you can change this later) !</div>}
                            <div className="grid-o o3x2 margin-sm centered" style={{columnGap: "calc(max(150px, 20%))"}}>
                                {class_list.map((e , index)=> {
                                    return <ClassCard data={e} register={register} key={index} />
                                })}
                            </div>
                            <span>psst... you can select multiple classes for multi-class builds!</span>
                        </FieldSet>
                        
                        <FieldSet legend_title="Stats" toggle={true} description="Roll for Stats or select predefined set!">
                            <div></div>
                        </FieldSet>
     
                        <input type="submit" value="Next"/>
                    </form>
                    <DevTool control={control} />
                </Fragment>

            } */}
        </Fragment>
    )
}