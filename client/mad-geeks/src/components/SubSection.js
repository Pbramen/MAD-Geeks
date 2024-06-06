export function SubSection({title, children}) {
    return (
        <section className="flex flex-column">
            <h2>
                {title}
            </h2>
            <hr />
            {children}
        </section>
    )
}