
/* 
    Helper class that just reformats debug messages for easier reading.
    Used for testing within a single endpoint/ or throughout a debugger.
*/
export class DebugConsoleMessager{
    public readonly enabled;
    public readonly init_filename;
    public readonly startTime;
    public readonly requestContext; 

    constructor(enabled: boolean, init_filename: string, requestContext?: object) {
        this.enabled = enabled;
        this.init_filename = init_filename;
        this.startTime = Date.now();
        if (requestContext !== null) {
            this.requestContext = requestContext;
        }
        console.log('=================== Request Start ====================')
    }

    log(filename: string, message: string) {
        if (this.enabled) {
            const date_now = (this.startTime - Date.now()) / 1000;
            console.log(`\t[${date_now}]: at [${filename}] `);
            console.log(`\t\t${message}`)
            console.log('\t----------------------------------------')
        }
    }
}