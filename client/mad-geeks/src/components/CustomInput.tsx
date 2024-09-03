type ArrowParams = { children: React.ReactNode, identity: string, onClickHandler: React.MouseEventHandler };
// returns an JSX component that returns buttons on both sides to help increment and decrement child value.
export const ArrowsInput = ({ children, identity, onClickHandler }: ArrowParams) => {
    // placeholder button 
    return (
        <div className="flex flex-row" >
            <button id={`${identity}_subtract`} type="button" name="subtract" onClick={onClickHandler} className={`arrow-btn`}> - </button>
            <div id={`${identity}_value`} className="static-number">{children}</div>
            <button id={ `${identity}_addition` } type="button" name="add" onClick={onClickHandler} className={`arrow-btn`}> + </button>
        </div>
    )
}

// =========================================================================================================

type UniqueSelectorT = {
    identity: string,
    options?: Set<number | string>,
    onChangeHandler: React.ChangeEventHandler,
    value: string | number,
}
export const UniqueSelector = ({ identity, options , onChangeHandler, value }: UniqueSelectorT) => {

    const list = [];
    const option = options.forEach((e, index) => {
        const jsx = (<option key={`opt_${identity}_${index}`} value={e}>{e}</option>)
        list.push(jsx)
    });

    return (
        <div className='flex flex-row'>
            <select id={identity} onChange={onChangeHandler} value={value} style={{
                width: '55px', height: '35px', textAlign: 'center'}}>
                {list}
            </select>
        </div>
    )
}
