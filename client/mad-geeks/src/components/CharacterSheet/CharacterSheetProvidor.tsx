import { SheetContext } from "./CharacterSheetContext";
import React, { ReactNode, useState } from "react";
import {PaginationContext } from "components/Pagination/PaginationContext";
import { errorList, FormErrorContext } from "components/context/CharacterFormErrorsContext";
import { Outlet } from "react-router-dom";
import {
    demographic,
    class_type,
    combat,
    inventory,
    spells,
    bonus_info
} from "./CharacterSheetType";


const bonusInfo: bonus_info = {
    proficiency: false,
    expertise: false,
    bonus: 0
}

const demographicState: demographic = {
    biography: {},
    appearance: {},
    traits: {},
    background: {}
}
const classesState : class_type= {
    "SRD": {
    "artificer": 0,
    "barbarian": 0,
    "bard": 0,
    "cleric": 0,
    "druid": 0,
    "fighter": 0,
    "monk": 0,
    "paladin": 0,
    "ranger": 0,
    "rogue": 0,
    "sorcerer": 0,
    "warlock": 0,
    "wizard": 0  
    },
    "custom": [],
    "hit_die": {
    "roll": {
        "die": 1,
        "quantity": 1, // todo: limit range.
        "min_r": 0,
        "max_r": 0
    },
    "pool": {
        "current": 0,
        "max": 0
    }
    },
    "fullname": '',
    "stat_block": [],
    "AC": 0,
    "img": '',
    }
const combatState : combat ={
    ability_feats: [],
    'saving_throw': {
    "str": {...bonusInfo},
    "dex": {...bonusInfo},
    "con": {...bonusInfo},
    "wis": {...bonusInfo},
    "int": {...bonusInfo},
    "char": {...bonusInfo}
    }, 
    "skills": {
    "acrobatics":{...bonusInfo},
    "animal_handling":{...bonusInfo},
    "arcana":{...bonusInfo},
    "athletics":{...bonusInfo},
    "deception":{...bonusInfo},
    "history":{...bonusInfo},
    "insight":{...bonusInfo},
    "intimidation":{...bonusInfo},
    "investigation":{...bonusInfo},
    "medicine":{...bonusInfo},
    "nature":{...bonusInfo},
    "perception":{...bonusInfo},
    "performance":{...bonusInfo},
    "persuasion":{...bonusInfo},
    "religion":{...bonusInfo},
    "sleight_of_hand":{...bonusInfo},
    "stealth":{...bonusInfo},
    "survival":{...bonusInfo}
    }
}
const inventoryState: inventory =  {
    "equipment": [],
    "currency": {
    "electrium": 0,
    "platinum": 0,
    "gold": 0,
    "silver": 0,
    "copper": 0,
    "custom": []
    },
}
const spellsState: spells[] = []  
  
export function CharacterSheetProvidor({ }) {
    const [demographic, setDemographic] = useState<demographic>(demographicState);
    const [classes, setClasses] = useState<class_type>(classesState);
    const [skills, setSkills] = useState<combat>(combatState);
    const [inventory, setInventory] = useState<inventory>(inventoryState);
    const [spells, setSpells] = useState<spells[]>(spellsState);


    const [current_page, setCurrent_Page] = useState<number>(0);
    const [max_page, setMax_page] = useState<number>(0);


    const [demographic_err, setDemographic_err] = useState<demographic>(demographicState);
    const [classAndStats_err, setClassAndStats_err] = useState<errorList>({});
    const [skills_err, setSkills_err] = useState<errorList>({});
    const [inventory_err, setInventory_err] = useState<errorList>({});
    const [spells_err, setSpells_err] = useState<errorList>({});
    const [other_err, setOther_err] = useState<errorList>({});


    const err_obj = {
        demographic_err,
        classAndStats_err,
        skills_err,
        inventory_err,
        spells_err,
        other_err,
        setDemographic_err,
        setClassAndStats_err,
        setSkills_err,
        setInventory_err,
        setSpells_err,
        setOther_err
    }
    return (
        <PaginationContext.Provider value={{current_page, setCurrent_Page, max_page, setMax_page}}>
            <SheetContext.Provider value={{
                demographic,
                setDemographic,
                classes,
                setClasses,
                skills,
                setSkills,
                inventory,
                setInventory,
                spells,
                setSpells
            }} >
                <FormErrorContext.Provider value={{...err_obj}} >
                    <Outlet />
                </FormErrorContext.Provider>
            </SheetContext.Provider>  
        </PaginationContext.Provider>
    )
}