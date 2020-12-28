const reduceArrToObj = (arr, defaultValue = null) =>
  arr.reduce((obj, el) => {
    obj[el] = defaultValue;
    return obj;
  }, {});

const getIssueIdFromKey = (issueKey) => issueKey.split('-').slice(-1)[0];

export { reduceArrToObj, getIssueIdFromKey };
