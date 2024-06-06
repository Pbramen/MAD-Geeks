import '../assets/css/grid.css'
import { SubSection } from './SubSection'
import { DraggableToken } from './DraggableToken'
export function AsideMenu() {

    return (
        <>
            <section className="aside-menu last-flex-item">
            <SubSection title="Tokens">
                <DraggableToken key="1" id='1' dropEffect='copy' />
            </SubSection>
            </section>
        </>
    )
}