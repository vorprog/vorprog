module.exports = (symbolName, size = 12) => {
  return {
    xmlns: `http://www.w3.org/2000/svg`,
    tag: `svg`,
    id: `${symbolName}-svg`,
    width: `${size}`,
    height: `${size}`,
    viewBox: `0 0 24 24`,
    children: [{
      xmlns: `http://www.w3.org/2000/svg`,
      tag: `use`,
      href: `#${symbolName}`,
    }]
  };
};
