const map = require('lodash.map');
const randomData = require('./data/randomData');
const newElement = require('./utilities/utilities').newElement;

const startup = () => {
  console.log(`Document intialized.`);
  const dataTable = document.getElementById("data-table")

  const tableHeaderRow = newElement(dataTable, { tag: `tr` })
  const tableHeader1 = newElement(tableHeaderRow, { tag: `td`, id: `column1-header` });
  newElement(tableHeader1, { class: `resizable`, textContent: `Column 1` });

  const tableHeader2 = newElement(tableHeaderRow, { tag: `td`, id: `column2-header` });
  newElement(tableHeader2, { class: `resizable`, textContent: `Column 2` });

  const tableHeader3 = newElement(tableHeaderRow, { tag: `td`, id: `column3-header` });
  newElement(tableHeader3, { class: `resizable`, textContent: `Column 3` });

  const tableHeader4 = newElement(tableHeaderRow, { tag: `td`, id: `column4-header` });
  newElement(tableHeader4, { class: `resizable`, textContent: `Column 4` });

  map(new Array(40), (data, index) => {
    const someRandomData = randomData();
    newElement(dataTable, {
      tag: `tr`,
      id: `data-${index}`,
      children: [
        { tag: `td`, textContent: someRandomData.randomWord },
        { tag: `td`, textContent: someRandomData.randomPangram },
        { tag: `td`, textContent: someRandomData.randomInteger },
        { tag: `td`, textContent: someRandomData.randomGuid },
      ]
    });
  });
};

(async () => {
  document.addEventListener(`DOMContentLoaded`, startup);
})();
