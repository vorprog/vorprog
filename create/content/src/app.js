const map = require('lodash.map');
const pangrams = require('./data/pangrams');
const newElement = require('./utilities/utilities').newElement;
const svgData = require('./data/svg');

const startup = () => {
  console.log(`Document intialized.`);
  const body = document.body;

  const header = newElement(body, { id: `header`, class: `light-grey space-between row` });

  const leftHeaderSection = newElement(header, { id: `left-header` });
  const menuSvg = newElement(leftHeaderSection, { id: `menu`, tag: `svg`, xmlns: `http://www.w3.org/2000/svg`, width: `24`, height: `24`, viewBox: `0 0 24 24` });
  const menuPath = newElement(menuSvg, { tag: `path`, xmlns: `http://www.w3.org/2000/svg`, d: svgData.menuPath, });
  const searchSvg = newElement(leftHeaderSection, { id: `search`, tag: `svg`, xmlns: `http://www.w3.org/2000/svg`, width: `24`, height: `24`, viewBox: `0 0 24 24` });
  const searchPath = newElement(searchSvg, { tag: `path`, xmlns: `http://www.w3.org/2000/svg`, d: svgData.searchPath });

  const rightHeaderSection = newElement(header, { id: `right-header` });
  const notificationSvg = newElement(rightHeaderSection, { id: `notifications`, tag: `svg`, xmlns: `http://www.w3.org/2000/svg`, width: `24`, height: `24`, viewBox: `0 0 24 24` });
  const notificationPath = newElement(notificationSvg, { tag: `path`, xmlns: `http://www.w3.org/2000/svg`, d: svgData.notificationPath });
  const profileSvg = newElement(rightHeaderSection, { id: `profile`, "on-click": newElement, tag: `svg`, xmlns: `http://www.w3.org/2000/svg`, width: `24`, height: `24`, viewBox: `0 0 24 24` });
  const profilePath = newElement(profileSvg, { tag: `path`, xmlns: `http://www.w3.org/2000/svg`, d: svgData.profilePath });

  const settingsMenu = newElement(rightHeaderSection, { id: `settings`, class: `grey popup` });
  settingsMenu.style.display = `none`;
  const text = newElement(settingsMenu, { id: `settings-link-1`, textContent: `<insert link here>` });

  profileSvg.onclick = () => settingsMenu.style.display === `none` ? settingsMenu.style.display = `block` : settingsMenu.style.display = `none`;

  const mainRow = newElement(body, { id: `main-row`, class: `row` });

  const rows = [];
  let currentRow;
  const pangramElements = map(pangrams.list, (pangram, index) => {
    if (index % 4 === 0) {
      currentRow = newElement(mainRow, { class: `margin-bottom row` });
      rows.push(currentRow);
    }
    return newElement(currentRow, { id: `pangram-${index}`, class: `grey curved`, textContent: pangram + pangram })
  });

  const footer = newElement(body, { id: `footer`, class: `grey row` });
  const footerContent = newElement(footer, { textContent: `FOOTER` });
};

(async () => {
  document.addEventListener(`DOMContentLoaded`, startup);
})();
