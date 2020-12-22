const getSvgConfig = require('./getSvgConfig');

module.exports = (columnName) => {
  return {
    tag: `td`,
    id: `${columnName}-header`,
    children: [
      {
        class: `resizable`,
        textContent: `${columnName}`,
        children: [
        getSvgConfig(`sort-symbol`)
        ]
      },
    ]
  };
};
