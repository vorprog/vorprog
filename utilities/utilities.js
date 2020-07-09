const childProcess = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

module.exports = {
    exec: util.promisify(childProcess.exec),
    generateGuid: crypto.randomBytes(16).toString("hex"),
    randomNumber: (min = 1, max = 100) => Math.random() * (max - min) + min,
    sleep: util.promisify(setTimeout),
    writeFile: util.promisify(fs.writeFile),
    readFile: util.promisify(fs.readFile),
    deleteFile: util.promisify(fs.unlink),
    getObjectFromJsonFile: async (path) => JSON.parse(await this.readFile(path).toString()),
    writeObjectToFile: async (path, object) => await this.writeFile(path, JSON.stringify(object)),
};

exports.printMsg = function () {
    console.log("This is a message from the vorprog.utilities package");
}