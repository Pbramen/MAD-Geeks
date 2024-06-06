export const dragStart = (e, type = 'id', dropEffect) => {
    e.dataTransfer.setData('text', e.target.id);
    e.dataTransfer.dropEffect = dropEffect;
    console.log("start drag")
}

export const dragOver = (e) => {
    console.log("drag over");
    e.preventDefault();
}

export const dragDropped = (e, MIME) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    return data;
}

