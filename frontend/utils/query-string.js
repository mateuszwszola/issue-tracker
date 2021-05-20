// ref: https://stackoverflow.com/questions/37230555/get-with-query-string-with-fetch-in-react-native
function objToQueryString(obj) {
  const keyValuePairs = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
      keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }
  return keyValuePairs.join('&');
}

export { objToQueryString };
