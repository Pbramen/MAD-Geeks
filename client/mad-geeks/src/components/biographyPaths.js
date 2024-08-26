const lookupPaths = () => {
    const page = 'biography.'
    const tab1 = page + 'appearance';
    const tab2 = page + 'background';
    const tab3 = page + 'personality';
    const tab4 = page + "demographic";
    
    const page2 = 'classes.'
    const tab2a = page2 +'classes'
    const tab2b = page2 + 'stats'
 
    const data = [{
        id: "biography",
        eyes: tab1,
        hair: tab1,
        skin: tab1,
        weight: tab1,
        other: tab1,

        backstory: tab2,
        enemies: tab2,
        allies: tab2,
        fraction: tab2,

        flaws: tab3,
        alignment: tab3,
        personality: tab3,

        charcter_name: tab4,
        // for testing...
        first_name: tab4,
        middle_name: tab4,
        last_name: tab4,
        // end testing.
        age: tab4,
        gender: tab4,
        species: tab4,
    },
    {
        id: "classes",
        fighter: tab2a,
        barbarian: tab2a,
        bard: tab2a,
        cleric: tab2a,
        druid: tab2a,
        monk: tab2a,
        paladin: tab2a,
        ranger: tab2a,
        rogue: tab2a,
        sorcerer: tab2a,
        warlock: tab2a,
        wizard: tab2a,
        
        str: tab2b,
        dex: tab2b,
        con: tab2b,
        int: tab2b,
        wis: tab2b,
        cha: tab2b
        },
        {
            id: 'skills',
                
        }   
    
    ]
        
       
    return data;
}
export const biography_fields = lookupPaths();
