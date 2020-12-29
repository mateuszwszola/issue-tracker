const reduceArrToObj = (arr, defaultValue = null) =>
  arr.reduce((obj, el) => {
    obj[el] = defaultValue;
    return obj;
  }, {});

const getIssueIdFromKey = (issueKey) => issueKey.split('-').slice(-1)[0];

const getProjectKeyFromTicketKey = (key) => key.split('-').slice(0, 2).join('-');

export { reduceArrToObj, getIssueIdFromKey, getProjectKeyFromTicketKey };
