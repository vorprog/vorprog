const map = require('lodash.map');
const pangrams = require('./data/pangrams');

/**
 * @returns {HTMLElement | SVGElement}
 */
const newChild = function (params) {
  const element = document.createElementNS(params.xmlns || `http://www.w3.org/1999/xhtml`, params.tag || `div`);
  element.textContent = params.textContent || null;
  if (params.class) element.className = params.class;

  delete params.xmlns;
  delete params.tag;
  delete params.textContent;
  delete params.class;

  map(params, (value, key) => element.setAttribute(key, value || ``));
  return this.appendChild(element)
}

HTMLElement.prototype.newChild = newChild;
SVGElement.prototype.newChild = newChild;

const getSVGConfig = (params) => Object.assign(params, { tag: `svg`, xmlns: `http://www.w3.org/2000/svg`, width: `24`, height: `24`, viewBox: `0 0 24 24` });
const getPathConfig = (params) => Object.assign(params, { tag: `path`, xmlns: `http://www.w3.org/2000/svg` });

const startup = () => {
  console.log(`Document intialized.`);
  const body = document.body;
  const bannerRow = body.newChild({ class: `row` });
  const leftBannerSection = bannerRow.newChild({ class: `item` });
  const menuSvg = leftBannerSection.newChild(getSVGConfig({ class: `item` }));
  const menuPath = menuSvg.newChild(getPathConfig({ d: `M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z` }));
  const searchSvg = leftBannerSection.newChild(getSVGConfig({ class: `item` }));
  const searchPath = searchSvg.newChild(getPathConfig({ d: `M23.822 20.88l-6.353-6.354c.93-1.465 1.467-3.2 1.467-5.059.001-5.219-4.247-9.467-9.468-9.467s-9.468 4.248-9.468 9.468c0 5.221 4.247 9.469 9.468 9.469 1.768 0 3.421-.487 4.839-1.333l6.396 6.396 3.119-3.12zm-20.294-11.412c0-3.273 2.665-5.938 5.939-5.938 3.275 0 5.94 2.664 5.94 5.938 0 3.275-2.665 5.939-5.94 5.939-3.274 0-5.939-2.664-5.939-5.939z` }));
  const profileSvg = bannerRow.newChild(getSVGConfig({ class: `item` }));
  const profilePath = profileSvg.newChild(getPathConfig({ d: `M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z` }));

  let currentRow;
  const pangramElements = map(pangrams.list, (pangram, index) => {
    if ((index + 1) % 2) currentRow = body.newChild({ class: `row` });
    return currentRow.newChild({ index: index, class: `item bordered`, textContent: pangram })
  });

  // let theInput = body.newChild({ id: `input`, class: `row`, contenteditable: true });
  // theInput.onkeyup = hitKey => {
  //   if (hitKey.keyCode == 32) {
  //     status.innerHTML = `Space bar pressed . . .`
  //   }
  // };
};

(async () => {
  document.addEventListener('DOMContentLoaded', startup);
})();
