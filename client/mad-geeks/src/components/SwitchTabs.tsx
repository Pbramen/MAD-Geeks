type SwitchTabsT = {
    selected: string,
    pattern: {
        [key: string]: {
            id: string, value: string
        }
    },
    onClickHandler: React.MouseEventHandler
};
// Layout ONLY -> for switching input mode for a form ( or other similar content display ) 
export const SwitchTabs = ({selected,  pattern, onClickHandler } : SwitchTabsT) => {
    
    const list = Object.values(pattern).map((e, index) => {
        return (
            <button
                id={e.id}
                name={e.id}
                className={`btn-1 btn-xl ${selected === e.id ? 'btn-active' : ''}`}
                key={`btn-${index}`}
                onClick={onClickHandler}
                type="button"
            >
                {e.value}
            </button>
        )
    })
    return (<>{list}</>)
}
