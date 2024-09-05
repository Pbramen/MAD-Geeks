import { ability_score_model } from "assets/dndModel"
import '../../assets/css/pop-up.css';

export const StatInformation = ({onClick}) => {
    
    return (
        <>
            <div id='pop-up-label' className='off-field'>Click to close summary page</div>
            <div role='none' className="pop-up-cover" onClick={onClick} />
            <div className="pop-up info-wrapper">
                <div className="flex flex-row" style={{justifyContent: "space-between", marginBottom: '1em'}}>
                    <h2>Summary of Each Ability</h2>
                    <button type='button' className="circle-btn red-background medium-btn" onClick={onClick}>X</button>
                </div>
                    <section className='res-3-2' >
                    {ability_score_model.map((e, i) => {
                        return (
                            <div  key={`stat_info_${i}`} className='aside_note deep_blue_card_shadow'>
                                <div>
                                    <div className="flex flex-column stat-info">
                                        <h3 ><strong className='bold-dark-header'>{e.term} ({e.abbr})</strong></h3>
                                        <p>{e.description} </p> 
                                        <span className="example-text"><i>{e.example}</i></span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    </section>
            </div>
        
        </>
    )
}