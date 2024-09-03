
import { StandardArray, PointBuy, RollCharacterStatsPage } from "../FormSection/AbilityScore/RollAllocationController"

type ModelPattern = {
    [key: string]: {
        id: string, // used for html id, and looking up state 
        value: string, // the actual string that will be displayed to users on the button UI
        element?: React.ReactNode // JSX element that will be rendered on lookup.
    }
}
// Model for each seperate allocation mode 
export const useABSModel = (mainClass : string, state: any, setStats: any ) : ModelPattern => {
    // retrieve the class that the user is most likely going to focus on (higest level)

    const patterns : ModelPattern= {
        standard: { id: 'standard', value: 'Standard Array', element: <StandardArray mainClass={mainClass} state={state} setStats={setStats} />},
        buy: { id: 'buy', value: 'Point Buy',  element: <PointBuy mainClass={mainClass}  state={state} setStats={setStats}  />  },
        roll: { id: 'roll', value: "Roll", element: <RollCharacterStatsPage state={state} setStats={setStats} /> }
    }
    return patterns;
}
