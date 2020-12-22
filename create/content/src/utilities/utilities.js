const map = require('lodash.map');
const getSvgConfig = require('./getSvgConfig');
const getColumnHeaderConfig = require('./getColumnHeaderConfig');

  /**
  * @returns {HTMLElement | SVGElement}
  */
const newElement = (parent, params = {}) => {
  const element = document.createElementNS(params.xmlns || `http://www.w3.org/1999/xhtml`, params.tag || `div`);
  element.textContent = params.textContent || null;
  map(params.children, child => newElement(element, child));

  delete params.xmlns;
  delete params.tag;
  delete params.textContent;
  delete params.children;

  map(params, (value, key) => element.setAttribute(key, value || ``));
  return parent.appendChild(element)
}

module.exports = {
  getSvgConfig: getSvgConfig,
  getColumnHeaderConfig: getColumnHeaderConfig,
  newElement: newElement
}