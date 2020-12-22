const map = require('lodash.map');
const randomData = require('./data/randomData');
const utilities = require('./utilities/utilities');

const startup = () => {
  console.log(`Document intialized.`);
  document.getElementById(`filter`).focus();
  const dataTable = document.getElementById(`data-table`);
  utilities.newElement(dataTable, {
    tag: `tr`,
    class: `grey-444`,
    children: [
      utilities.getColumnHeaderConfig(`column1`),
      utilities.getColumnHeaderConfig(`column2`),
      utilities.getColumnHeaderConfig(`column3`),
      utilities.getColumnHeaderConfig(`column4`),
    ]
  });

  map(new Array(40), (data, index) => {
    const someRandomData = randomData();
    utilities.newElement(dataTable, {
      tag: `tr`,
      id: `data-${index}`,
      children: [
        { tag: `td`, class: `grey-border`, textContent: someRandomData.randomWord },
        { tag: `td`, class: `grey-border`, textContent: someRandomData.randomPangram },
        { tag: `td`, class: `grey-border`, textContent: someRandomData.randomInteger },
        { tag: `td`, class: `grey-border`, textContent: someRandomData.randomGuid },
      ]
    });
  });
};

(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams.get(`blee`));
  document.addEventListener(`DOMContentLoaded`, startup);
})();
