export const generateNumberAsString = (n, m, offset=1) => {
    var list = []; 
    let i = offset;
    n += offset;

    for (i = i; i < n; i++){
        if (i < 10) {
            list.push(`${i}`.padStart(m, "0"));    
        }
        else
            list.push(`${i}`);
    }
    return list;
}

