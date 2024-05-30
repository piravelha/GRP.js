
function ListSign(array) {
  let result;

  for (let i = 0; i < array.length; i++) {
    if (i === 0) {
      result = i
    } else {
      result = (array[i] > 0
        ? 1
        : array[i] < 0
          ? -1
          : 0)
        * result;
    }
  }
}

console.log([2, -2, 1, 3, -6, -7]);
::
