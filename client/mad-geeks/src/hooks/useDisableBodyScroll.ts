// this MUST be used in a useEffect. 
export const useDisableBodyScroll = (condition: () => boolean) => {
    return () => {
        let bodyClasses = document.body.classList;
        if (condition()) {
            if (bodyClasses && bodyClasses.contains('scrollable')) {
                bodyClasses.remove('scrollable')
            }
            if (bodyClasses && !bodyClasses.contains('non-scrollable')) {
                bodyClasses.add('non-scrollable')
            }
        }
        else {
            if (bodyClasses && bodyClasses.contains('non-scrollable')) {
                bodyClasses.remove('non-scrollable')
            }
            if (bodyClasses && !bodyClasses.contains('scrollable')) {
                bodyClasses.add('scrollable')
            }
        }
    }
}
