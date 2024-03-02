const mongoose = require('mongoose');

class customSchema { 
    document; 

    constructor(document){
        this.document = document;
    }

    validateUniqueIndex() {
        const document = this.document;
        if (document) {
            return async function (path, message) {
                 try {
                     document.path(path).validate(async function (value) {
                         const v = await this.constructor.findOne({ path: value })
                         if (v)
                             return false
                         return true
                     }, message);
                 } catch (e) {
                     console.log(e);
                 }
             }
         }
    }
}
module.exports = customSchema;