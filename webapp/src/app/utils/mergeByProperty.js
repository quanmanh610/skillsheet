export function mergeByProperty(array1, array2, prop) {
  const origArr = { ...array1 };
  const updatingArr = { ...array2 };
  for (var i = 0, l = origArr.length; i < l; i++) {
    for (var j = 0, ll = updatingArr.length; j < ll; j++) {
      if (origArr[i][prop] === updatingArr[j][prop]) {
        origArr.splice(i, 1, updatingArr[j]);
      }
    }
  }
  return { ...origArr }
}