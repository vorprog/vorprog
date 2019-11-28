const _ = require('lodash');

const elemancer = {
    setAttributes: (element, attributes = {}) =>
        _.map(attributes, (value, key) => element.setAttribute(key, value || ``)),
    setChildren: (element, children = []) =>
        _.map(children, child => typeof child === "string" ? element.innerHtml += child : element.appendChild(child)),
    element: (params = `div`) => {
        if (typeof params === `string`) return document.createElement(params);
        const result = document.createElement(params.tag || `div`);
        elemancer.setAttributes(result, params.attributes);
        elemancer.setChildren(result, params.children);
        return result;
    },
    createElementWithTag: (tag, params) => { params.tag = tag; return elemancer.element(params); },
    h1: (params) => elemancer.createElementWithTag(`h1`, params),
    input: (params) => elemancer.createElementWithTag(`input`, params),
    table: (params) => elemancer.createElementWithTag(`table`, params),
}

module.exports = {
    initializeExtensionMethods: () => {
        HTMLElement.prototype.appendElement = function (params) { return this.appendChild(elemancer.element(params)) };
        HTMLElement.prototype.appendH1 = function (params) { return this.appendChild(elemancer.h1(params)) };
        HTMLElement.prototype.appendInput = function (params) { return this.appendChild(elemancer.input(params)) };
        HTMLElement.prototype.appendTable = function (params) { return this.appendChild(elemancer.table(params)) };
    }
};