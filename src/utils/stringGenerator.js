const stringGenaretor = (length) => {
  const arr = [];
  for (let i = 0; i < length; i += 1) {
    arr.push('A');
  }
  return arr.reduce((acc, cur) => acc + cur);
};

module.exports = stringGenaretor;
