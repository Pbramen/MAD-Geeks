interface Data {
    path: string,
    value: string
}

interface returnData{
    status: string,
    msg: string,
    errors: Array<Data>
}

class MongoDuplicateError extends Error{
    data: returnData;
    code: Number;
    constructor(message: string, data: Array<Data>) {
        super(message);
        this.name = "MongoDuplicateError";
        this.data = this.formatData(data);
        this.code = 11000;
    }

    formatData(data: Array<Data>): returnData {
        var msg: string = data.reduce((accum, curr) => {
            return accum + `${curr.path}, `;
        }, "").slice(0, -2) + ' must be unique';
        
        const obj: returnData = {
            status: "DUP_ERR",
            msg: msg, 
            errors: data
        }
        return obj;    
    }
}

export = {MongoDuplicateError};