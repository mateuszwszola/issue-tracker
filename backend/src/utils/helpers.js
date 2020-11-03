function pickExistingProperties(values, srcObject) {
  const newObj = {};
  values.forEach((value) => {
    if (srcObject[value] !== undefined) {
      newObj[value] = srcObject[value];
    }
  });
  return newObj;
}

export { pickExistingProperties };
