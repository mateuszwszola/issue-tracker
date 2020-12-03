const reduceArrToObj = (arr, defaultValue = null) =>
  arr.reduce((obj, el) => {
    obj[el] = defaultValue;
    return obj;
  }, {});

export { reduceArrToObj };
