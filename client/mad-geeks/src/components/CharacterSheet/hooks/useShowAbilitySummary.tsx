import { useState, useEffect } from 'react';

export const useShowAbilitySummary = () => {
    const [isSummaryVisable, setSummaryVisable] = useState<boolean>(false); 

    useEffect(() => {
        let bodyClasses = document.body.classList;
        console.log(bodyClasses);
        if (isSummaryVisable === true) {
            if (bodyClasses && bodyClasses.contains('scrollable')) {
                bodyClasses.remove('scrollable')
            }
            if (bodyClasses && !bodyClasses.contains('non-scrollable')) {
                bodyClasses.add('non-scrollable')
                console.log('body is not scrollable now!')
            }
        }
        // allow body to scroll again
        else {
            if (bodyClasses && bodyClasses.contains('non-scrollable')) {
                bodyClasses.remove('non-scrollable')
            }
            if (bodyClasses && !bodyClasses.contains('scrollable')) {
                bodyClasses.add('scrollable')
                console.log("body is now scrollable");
            }
        }
    }, [isSummaryVisable])
    const showSummary = (e: React.MouseEvent) => {
        setSummaryVisable(prev => !prev);
    }
    
    return {
        isSummaryVisable, setSummaryVisable, showSummary
    }
}

