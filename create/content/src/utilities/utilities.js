const map = require('lodash.map');

  /**
  * @returns {HTMLElement | SVGElement}
  */
const newElement = (parent, params = {}) => {
  const element = document.createElementNS(params.xmlns || `http://www.w3.org/1999/xhtml`, params.tag || `div`);
  element.textContent = params.textContent || null;
  if (params.class) element.className = params.class;
  map(params.children, child => newElement(element, child));

  delete params.xmlns;
  delete params.tag;
  delete params.textContent;
  delete params.class;
  delete params.children;

  map(params, (value, key) => element.setAttribute(key, value || ``));
  return parent.appendChild(element)
}

module.exports = {
  newElement: newElement
}