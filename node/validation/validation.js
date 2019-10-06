module.exports = {
    isFunction: (target) => target && typeof (target) === 'function',
    isSymbol: (target) => target && typeof (target) === 'symbol',
    isObject: (target) => target && typeof (target) === 'object' && !Array.isArray(target),
    isArray: (target) => target && typeof (target) === 'object' && Array.isArray(target),
    isBool: (target) => target && typeof (target) === 'boolean',
    isNumber: (target) => target && typeof (target) === 'number',
    isBigInt: (target) => target && typeof (target) === 'bigint',
    isString: (target) => target && typeof (target) === 'string' && target.trim() !== '',
    isAlphaNumeric: (target) => this.isString(target) && /^[a-zA-Z0-9]*$/.test(target),
    isInformalPhoneNumber: (target) => this.isString(target) && /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(target),
    isEmail: (target) => this.isString(target) && /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/.test(target),
    isDate: (target) => this.isString(target) && Date.parse(target) !== NaN,
};