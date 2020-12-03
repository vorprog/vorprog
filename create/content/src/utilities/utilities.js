const map = require('lodash.map');

module.exports = {
  /**
  * @returns {HTMLElement | SVGElement}
  */
  newElement: (parent, child = {}) => {
    const element = document.createElementNS(child.xmlns || `http://www.w3.org/1999/xhtml`, child.tag || `div`);
    element.textContent = child.textContent || null;
    if (child.class) element.className = child.class;

    delete child.xmlns;
    delete child.tag;
    delete child.textContent;
    delete child.class;

    map(child, (value, key) => element.setAttribute(key, value || ``));
    return parent.appendChild(element)
  }
}