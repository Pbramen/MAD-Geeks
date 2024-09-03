// single source of truth for image dice path 
// placeholder images...
export const getDiceImageLocation = () => {
    const base_dir = 'public/';
    const path = 'img/dice/';
    // note: SOME dies types will have different images
    const d4 = ['d6_1.png', 'd6_2.png', 'd6_3.png', 'd6_4.png'];
    const d6 = [...d4, 'd6_5.png', 'd6_6.png'];
    return {
        d4, d6, path
    }
    // TODO : add more images for up to d10!
}
