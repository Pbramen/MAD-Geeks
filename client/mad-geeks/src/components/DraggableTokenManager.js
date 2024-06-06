import { useState } from 'react';


const _fallbackTokens = () => {
    return {
        '1': {
            'version': 0,
            'status': 'ok',
            'auth': []
        }
    }
}
export function DraggableTokenManger({children, initTokens=_fallbackTokens()}) {
    const [tokenManager, setTokenManager] = useState([initTokens]);

    const updateVersion = (tk_id, current_version) => { 
        if (tk_id in tokenManager) {
            let newCopy = { ...tokenManager };
            newCopy[tk_id].version += 1; 
            setTokenManager({newCopy})
        }
    }
    return updateVersion;
}