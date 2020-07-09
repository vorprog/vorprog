const logConfig = require('./logConfig');

const getTimestamp = () => {
    const date = new Date();
    return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}--${date.getUTCHours()}-${date.getUTCMinutes()}-${date.getUTCSeconds()}-${date.getUTCMilliseconds()}`;
};

module.exports = (content, optionOverrides) => {
    let settings = logConfig.getSettings();
    let contextData = settings.getContext();
    let preposition = settings.formatContext(contextData);
    let text = `${getTimestamp()} ${preposition} ${content}`;
    console.log(text);
    return {
        message: content,
        loggedMessage: text
    };
};