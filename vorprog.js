const log = require('./log/log');
const utilities = require('./utilities/utilities');
const validation = require('./validation/validation');

module.exports = {
    log: log,
    utilities: utilities,
    validation: validation
};

// todo: update this master package list
// todo: update packages to use packages instead of source code
// todo: create a simple npx "create" app
// todo: update npx "create" app to use use elemancer, webpack, etc
// todo: add routing to npx "create" app
// todo: figure out how to use redux with npx "create" app
