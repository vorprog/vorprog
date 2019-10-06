const process = require('process');
const crypto = require('crypto');

const processGuid = crypto.randomBytes(16).toString("hex");

const settings = {
    getContext: () => ({
        processGuid: processGuid,
        processID: process.pid
    }),
    formatContext: (context) => JSON.stringify(context),
    timeStamp: () => Date.now(),
    startPrepWith: "(",
    endPrepWith: ")",
};

module.exports = {
    getSettings: () => settings
};