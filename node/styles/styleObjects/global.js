const constants = require('../../constants/constants');
const color = constants.colors.default;

module.exports = {
    body: {
        margin: 0,
        padding: 0,
        backgroundColor: color.darkGrey,
    },
    '*': {
        fontWeight: 500,
        fontFamily: 'Courier New',
        lineHeight: '20px',
        color: color.lightGrey,
        backgroundColor: color.grey
    },
    // 'p, h1, h2, h3, h4, h5, h6, ul, dl, dt, dd': {
    //   ...
    // },
    // 'button, input, optgroup, select, textarea': {
    //   ...
    // },
    // 'a, button': {
    //   ...
    // },
    // a: {
    //   ...
    // },
};