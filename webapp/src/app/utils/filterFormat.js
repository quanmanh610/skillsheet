export function filterFormat(arrayData, property) {
  const tempArray = [];
  const results = [];
  arrayData.map((obj) => {
    tempArray.push(obj[property]);
    return null;
  });
  const newTempArray = [...new Set(tempArray)];
  newTempArray.map((val) => {
    const format = {
      text: val,
      value: val,
    };
    results.push(format);
    return null;
  });
  return results;
}
