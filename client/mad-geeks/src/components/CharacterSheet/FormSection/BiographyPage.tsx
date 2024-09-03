import { FieldSet } from "components/FieldSet"
import { DynamicController } from "../DynamicController"


export const BiographyPage = ({ control, errors, sheetError }) => {
    const path = 'biography'

    const common = {
        state: sheetError,
        path: path,
        toggle: true
    }
    
    const demoSetting = {
        legend_title: "Demographic",
        description: "Forge your character's current physical state, and set their name, age, species, etc.",
        ...common
    }
    const backSettings = {
        legend_title: "Background",
        description: "Dig into the archives and define your characters previous journeys and relations",
        ...common
    }

    const appearanceSettings = {
        legend_title: "Appearance",
        description: "Depict the visage of your character, either by words, or image!",
        ...common
    }

    const personalitySettings = {
        legend_title: "Personality",
        description: "Detail your character's traits: quirks, weaknesses, strengths, and more.",
        ...common
    }
    
    return (
        <>
            <FieldSet key='demogrpahic' {...demoSetting}>
                <div className="flex flex-column form-body">
                    <div className="flex flex-row re-form">
                        <DynamicController
                            label="*Character Name:"
                            name="charcter_name"
                            validation={{
                                required: {
                                    value: true,
                                    message: 'Please fill out this field!'
                                },
                                maxLength: {
                                    value: 32,
                                    message: 'Limit to 32 characters max!'
                                }
                            }}
                            path={path + '.demographic'}
                            html="input"
                            maxLength={32}
                            errors={errors}
                            control={control}
                            
                        />
                    </div>
                    <div id="test" className="flex flex-row re-form" >
                        <DynamicController
                            label="Gender:"
                            name="gender"
                            path={path + '.demographic'}
                            html="input"
                            errors={errors}
                            control={control}
                            maxLength={32}
                        />
                        <DynamicController
                            label="Age:"
                            name="age"
                            validation={{
                                pattern: {
                                    value: '/^[0-9]*$/',
                                    message: "Age must be in number format only!"
                                }
                            }}
                            path={path + '.demographic'}
                            html="input"
                            errors={errors}
                            control={control}
                            type='number'
                            className="width-m"
                        />

                        <DynamicController
                            label="Species:"
                            path={path + '.demographic'}
                            html="select"
                            options={[
                                'Dragonborn', 'Dwarf', "Hafling", "Human", "Elf", "Half-elf", "Orc", "Half-Orc", 'Tiefling', "Other"
                            ]}
                            name="species"
                            errors={errors}
                            control={control}
                            className="width-m"
                        />
                    </div>
                </div>
            </FieldSet>
            {/* Background information */}
            <FieldSet {...backSettings} >
                <div className='flex flex-column form-textarea form-body'>
                <span className="optional-tag"><em>Optional</em></span>
                <DynamicController
                    name="backstory"
                    label="Backstory:"
                    path={path + '.background'}
                    html="textarea"
                    errors={errors}
                    control={control}
                    placeholder="Enter your tragic backstory here"
                />
                <DynamicController
                    name="allies"
                    label="Allies:"
                    path={path + '.background'}
                    html="textarea"
                    errors={errors}
                    control={control}
                    placeholder="List all friends and allies"
                />
                <DynamicController
                    name="enemies"
                    label="Enemies:"
                    path={path + '.background'}
                    html="textarea"
                    errors={errors}
                    control={control}
                    placeholder="List all your enemies"
                    />
                <DynamicController
                    name="fractions"
                    label="Fractions:"
                    path={path + '.background'}
                    html="textarea"
                    errors={errors}
                    control={control}
                    placeholder="List all organizations/fractions your character is apart of"
                />
                    </div>
            </FieldSet>
            <FieldSet {...appearanceSettings} >
                <DynamicController
                    name="height"
                    label="Height:"
                    path={path + '.appearance'}
                    html="input"
                    errors={errors}
                    control={control}
                    type="text"
                />
                <DynamicController
                    name="eye"
                    label="Eye color:"
                    path={path + '.appearance'}
                    html="input"
                    errors={errors}
                    control={control}
                    type="text"
                />
                
            </FieldSet>
            <FieldSet {...personalitySettings} >
                    hello
            </FieldSet>
        </>
    )
}
