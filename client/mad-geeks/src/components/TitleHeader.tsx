import React from 'react'
export function TitleHeader ({ title }: { title: string }) {

    return (
        <section className="page-title">
            <h2 className="header">{title}</h2>
        </section>
 
    )
}