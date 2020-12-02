const map = require('lodash.map');
const pangrams = require('./data/pangrams');

const startup = () => {
  console.log(`Initializing document ...`);

  HTMLElement.prototype.newChild = function (params) {
    const element = document.createElement(params.tag || `div`);
    element.textContent = params.textContent || null;
    delete params.textContent;
    element.className = params.class || null;
    delete params.class;
    map(params, (value, key) => element.setAttribute(key, value || ``));
    return this.appendChild(element)
  }

  const body = document.body;
  let currentRow = body.newChild({ class: `row` });
  let pangramElements = map(pangrams.list, (pangram, index) => {
    if (index % 2) currentRow = body.newChild({ class: `row` });
    return currentRow.newChild({ index: index, class: `item`, textContent: pangram })
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
