//BEWARE: this function does not work if the array contains circular references and is only used here
//on simple representations of the game board
function arrayDeepCopy(arr) {
  const newArr = [];
  if (!Array.isArray(arr)) {
    return arr;
  }
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arrayDeepCopy(arr[i]));
  }
  return newArr;
}

module.exports = arrayDeepCopy;
