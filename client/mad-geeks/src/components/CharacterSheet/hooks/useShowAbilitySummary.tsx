import { useState, useEffect } from 'react';
import { useDisableBodyScroll } from 'hooks/useDisableBodyScroll';

export const useShowAbilitySummary = () => {
    const [isSummaryVisable, setSummaryVisable] = useState<boolean>(false); 
    // Disable the main scroll to prevent clashing scroll
    const toggleScroll = useDisableBodyScroll(()=> isSummaryVisable)
    
    useEffect(() => {
        toggleScroll()
    }, [isSummaryVisable])

    const showSummary = (e: React.MouseEvent) => {
        setSummaryVisable(prev => !prev);
    }    

    return {
        isSummaryVisable, setSummaryVisable, showSummary
    }
}

