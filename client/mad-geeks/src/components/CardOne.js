const defaultStyles = {
    card: 'form-card',
    banner: 'card-banner',
    content: 'form-group'
}
export function CardOne({ children, title="MadGeeds", styles = defaultStyles }) {
    return (
        <section className={styles.card}>
            <div className={styles.banner}>{title}</div>
            <div className={styles.content}>
                {children}
            </div>
        </section>
    )   
}