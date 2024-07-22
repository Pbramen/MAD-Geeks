import React from 'react';
import { Link } from 'react-router-dom';
export interface listObject {
    id?: string,
    value: string,
    input?: boolean | null
    linkTo?: string | null
}

export const BannerMenu = ({ list }: {list: listObject[]}) => {
    return (
        <section>
            <ul className="nav sub-menu">
                {
                    list.map((e : listObject, index: number) => {
                        if (e.input) {
                            return <input className="search-bar" id={e.id} placeholder={e.value}/>
                        }
                        return <li key={index} className="nav-list">{
                            e.linkTo ? <Link to={e.linkTo}>{e.value}</Link> : e.value
                        }</li>
                    })
                }
            </ul>
        </section>
    )
}