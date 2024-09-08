const path = require("path");
const fs = require("fs");

const dir = fs.readdir(__dirname, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.error("Unable to access any files/directories");
        throw err;
    }
    var obj = {}
    files.filter(file => file.isDirectory()).forEach(file => {
        obj[file.name] = path.join(__dirname, file.name)
    })
    console.log(obj);
    return obj;
})

console.log(dir);