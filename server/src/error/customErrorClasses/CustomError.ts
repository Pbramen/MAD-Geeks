export class CustomAPIError extends Error {
    public readonly code; 
    public readonly endpoint;

    constructor(message: string, code: number, endpoint?: string) {
        if (new.target === CustomAPIError) {
            throw new Error("Attempted to use an abstract class CustomError")
        }
        super(message);
        this.code = code;
        this.endpoint = endpoint;
        
    }
    
    printStackTrace() { 
        console.error(this?.stack || 'stack not captured');
        if(this.endpoint !== null)
            console.error('\tat endpoint: ', this.endpoint);
    }
}