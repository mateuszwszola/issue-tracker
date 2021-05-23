const reduceArrToObj = (arr, defaultValue = null) =>
  arr.reduce((obj, el) => {
    obj[el] = defaultValue;
    return obj;
  }, {});

const filterObjectFalsy = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key]) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
};

const getIssueIdFromKey = (issueKey) => issueKey.split('-').slice(-1)[0];

const getProjectKeyFromTicketKey = (key) => key.split('-').slice(0, 2).join('-');

export { reduceArrToObj, getIssueIdFromKey, getProjectKeyFromTicketKey, filterObjectFalsy };
