_stack = [];

function _eq(a, b) {
  if (typeof a !== "object" || typeof b !== "object") {
    return a == b;
  }
  if (a.length !== b.length) {
    return 0;
  }
  for (let i = 0; i < a.length; i++) {
    if (_eq(a[i], b[i]) === 0) {
      return 0;
    }
  }
  return 1;
}

function _invoke(args) {
  if (args.length === 0) {
    return;
  }
  if (args.length === 1) {
    return args[0]();
  }
  f = args[0];
  args = args.slice(1);
  f(args);
}

function _id_Map(F) {
  let newArr = [];
  let arr = _stack.pop();
  for (let i = 0; i < arr.length; i++) {
    _stack.push(arr[i]);
    _invoke(F);
    newArr.push(_stack.pop());
  }
  _stack.push(newArr);
}

// |<<
function _id_Print() {
  let a = _stack.pop();
  console.log(a);
}
const _id__60_63 = _id_Print;

// +
function _id__43() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b + a);
}

// -
function _id__45() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b - a);
}

// *
function _id__42() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b * a);
}

// /
function _id__47() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b / a);
}

// %
function _id__37() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b % a);
}

// <
function _id__60() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b < a ? 1 : 0);
}

// >
function _id__62() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b > a ? 1 : 0);
}

// <=
function _id__60_61() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b <= a ? 1 : 0);
}

// >=
function _id__62_61() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b >= a ? 1 : 0);
}

// =
function _id__61() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(_eq(b, a));
}

// Head
function _id_Head() {
  let a = _stack.pop();
  _stack.push(a[0]);
}
const _id__60_124 = _id_Head;

// Tail
function _id_Tail() {
  let a = _stack.pop();
  _stack.push(a.slice(1));
}
const _id__124_62_62 = _id_Tail;

// Last
function _id_Last() {
  let a = _stack.pop();
  _stack.push(a[a.length - 1]);
}
const _id__124_62 = _id_Last;

// Init
function _id_Init() {
  let a = _stack.pop();
  _stack.push(a.slice(0, -1));
}
const _id__60_60_124 = _id_Init;

// Cons
function _id_Cons() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push([b].concat(a));
}
const _id__58_62 = _id_Cons;

