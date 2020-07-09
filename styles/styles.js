const aphrodite = require('aphrodite');
const mapValues = require('lodash.mapvalues');
const baseStylesObject = require('./styleObjects/base');
const globalStylesObject = require('./styleObjects/global');

const GLOBALS = '__GLOBAL_STYLES__';

const baseStyles = aphrodite.StyleSheet.create(baseStylesObject);

const globalExtension = {
    selectorHandler: (selector, baseSelector, generateSubtreeStyles) =>
        (baseSelector.includes(GLOBALS) ? generateSubtreeStyles(selector) : null),
};

module.exports = {
    initializeGlobalStyles: () => {
        const extended = aphrodite.StyleSheet.extend([globalExtension]);

        const globalStyles = extended.StyleSheet.create({
            [GLOBALS]: globalStylesObject
        });
        
        extended.css(globalStyles[GLOBALS]);
    },
    base: mapValues(baseStyles, style => aphrodite.css(style))
};
