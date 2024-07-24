export function setObject(obj: object) {
    Object.keys(obj).forEach(i => {
        const type_i = typeof i; 
        if (type_i === "object") {
            setObject(i as unknown as object);
        }
        i = null;
    })
}