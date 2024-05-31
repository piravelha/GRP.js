_stack = [];

function _eq(a, b) {
  if (typeof a !== "object" || typeof b !== "object") {
    return a == b ? 1 : 0;
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

function _repr(obj) {
  if (typeof obj !== "object") {
    return obj.toString();
  }

  let str = "[";
  let allChars = true;
  for (let i = 0; i < obj.length; i++) {
    if (typeof obj[i] !== "string") allChars = false;
    str += _repr(obj[i]);
    if (i < obj.length - 1) {
      str += " ";
    }
  }

  if (allChars) {
    let charStr = "\"";
    for (let i = 0; i < obj.length; i++) {
      charStr += obj[i];
    }
    return charStr + "\"";
  }

  return str + "]";
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

// Print
function _id_Print() {
  let a = _stack.pop();
  console.log(_repr(a));
}
const _id__60_63 = _id_Print; // <?

// PrintStack
function _id_PrintStack() {
  console.log(_repr(_stack));
}
const _id__60_63_63_63 = _id_PrintStack; // <???

// Duplicate
function _id_Duplicate() {
  let a = _stack.pop();
  _stack.push(a);
  _stack.push(a);
}
const _id__46 = _id_Duplicate; // .

// Ignore
function _id_Ignore() {
  _stack.pop();
}
const _id__44 = _id_Ignore; // ,

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

// Signum
function _id_Signum() {
  let a = _stack.pop();
  _stack.push(a > 0 ? 1 : a < 0 ? -1 : 0);
}
const _id__94_42 = _id_Signum; // ^*

// Max
function _id_Max() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(a > b ? a : b);
}
const _id__61_43_61 = _id_Max; // =+=

function _id_Min() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(a < b ? a : b);
}
const _idd__61_45_61 = _id_Min; // =-=

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

// /=
function _id__47_61() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(!_eq(b, a));
}

// Or
function _id_Or() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b !== 0 || a !== 0);
}
const _id__124 = _id_Or; // |

// Head
function _id_Head() {
  let a = _stack.pop();
  _stack.push(a[0]);
}
const _id__60_42 = _id_Head; // <*

// Tail
function _id_Tail() {
  let a = _stack.pop();
  _stack.push(a.slice(1));
}
const _id__42_62_62 = _id_Tail; // *>>

// Last
function _id_Last() {
  let a = _stack.pop();
  _stack.push(a[a.length - 1]);
}
const _id__42_62 = _id_Last; // *>

// Init
function _id_Init() {
  let a = _stack.pop();
  _stack.push(a.slice(0, -1));
}
const _id__60_60_42 = _id_Init; // <<*

// Cons
function _id_Cons() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push([b].concat(a)); // :>
}
const _id__58_62 = _id_Cons;

// Take
function _id_Take() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b.slice(0, a));
}

// !!
function _id__33_33() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(a[b + 1]);
}

// Slice
function _id_Slice() {
  let a = _stack.pop();
  let b = _stack.pop();
  let c = _stack.pop();
  _stack.push(c.slice(b - 1, a))
}

// Concat
function _id_Concat() {
  let a = _stack.pop();
  let b = _stack.pop();
  _stack.push(b.concat(a));
}
const _id__43_43 = _id_Concat;

// Length
function _id_Length() {
  let a = _stack.pop();
  _stack.push(a.length);
}
const _id__35 = _id_Length;

// Map
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
const _id__36_62 = _id_Map; // $>

// Filter
function _id_Filter(F) {
  let newArr = [];
  let arr = _stack.pop();
  for (let i = 0; i < arr.length; i++) {
    _stack.push(arr[i]);
    _invoke(F);
    if (_stack.pop() !== 0) {
      newArr.push(arr[i]);
    }
  }
  _stack.push(newArr);
}
const _id__38_62 = _id_Filter; // &>

// Reduce
function _id_Reduce(F) {
  let result;
  let arr = _stack.pop();
  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      result = arr[i];
    } else {
      _stack.push(arr[i]);
      _stack.push(result);
      _invoke(F);
      result = _stack.pop();
    }
  }
  _stack.push(result);
}
const _id__60_46_62 = _id_Reduce; // <.>

// ScanLeft
function _id_ScanLeft(F) {
  let arr = _stack.pop();
  let newArr = [];
  let acc;
  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      acc = arr[i]
      newArr.push(arr[i])
    } else {
      _stack.push(acc);
      _stack.push(arr[i]);
      _invoke(F);
      acc = _stack.pop();
      newArr.push(acc);
    }
  }
  _stack.push(newArr);
}
const _id__60_64 = _id_ScanLeft; // <@
function _id_Range() {
let _var_0 = _stack.pop();
function _id_Max() {
_stack.push(typeof _var_0 === "object" ? _var_0.map(x => x) : _var_0);
}
let _var_1 = _stack.pop();
function _id_Min() {
_stack.push(typeof _var_1 === "object" ? _var_1.map(x => x) : _var_1);
}
_id_Min();
_id_Max();
_id__62();
if (_stack.pop()) {
let _var_2 = [];
for (let i = 0; i < 0; i++) {
_var_2[-1-i] = _stack.pop();
}
_stack.push(_var_2);
}else {
_id_Min();
_id_Max();
_id_Min();
_stack.push(1);
_id__43();
_id_Range();
_id__58_62();
}
}
function _id_Indices() {
_stack.push(1);
_id_Range();
}
function _id_String() {
function _id_Split() {
let _var_3 = _stack.pop();
function _id_Sep() {
_stack.push(typeof _var_3 === "object" ? _var_3.map(x => x) : _var_3);
}
let _var_4 = _stack.pop();
function _id_Str() {
_stack.push(typeof _var_4 === "object" ? _var_4.map(x => x) : _var_4);
}
_id_Str();
_stack.push(2);
_id_Sep();
_id__35();
_stack.push(1);
_id__43();
_id_Slice();
let _var_5 = _stack.pop();
function _id_Sub() {
_stack.push(typeof _var_5 === "object" ? _var_5.map(x => x) : _var_5);
}
_id_Sep();
_id_Sub();
_id__61();
if (_stack.pop()) {
_id_Str();
_id_Sep();
_id__35();
_stack.push(2);
_id__43();
_id_Str();
_id__35();
_id_Slice();
let _var_6 = _stack.pop();
function _id_Rest() {
_stack.push(typeof _var_6 === "object" ? _var_6.map(x => x) : _var_6);
}
let _var_7 = [];
_id_Str();
_id__60_42();
for (let i = 0; i < 1; i++) {
_var_7[0-i] = _stack.pop();
}
_stack.push(_var_7);
_id_Rest();
_id_Sep();
_id_String()._id_Split();
_id__58_62();
} else if ((() => { _id_Str();
_id__35();
_stack.push(0);
_id__47_61();
 return _stack.pop(); })()) {
_id_Str();
_id__42_62_62();
let _var_8 = _stack.pop();
function _id_Rest() {
_stack.push(typeof _var_8 === "object" ? _var_8.map(x => x) : _var_8);
}
_id_Rest();
_id_Sep();
_id_String()._id_Split();
let _var_9 = _stack.pop();
function _id_Result() {
_stack.push(typeof _var_9 === "object" ? _var_9.map(x => x) : _var_9);
}
_id_Str();
_id__60_42();
_id_Result();
_id__60_42();
_id__58_62();
_id_Result();
_id__42_62_62();
_id__58_62();
}else {
let _var_10 = [];
let _var_11 = [];
for (let i = 0; i < 0; i++) {
_var_11[-1-i] = _stack.pop();
}
_stack.push(_var_11);
for (let i = 0; i < 1; i++) {
_var_10[0-i] = _stack.pop();
}
_stack.push(_var_10);
}
}
function _id_Join() {
let _var_12 = _stack.pop();
function _id_Sep() {
_stack.push(typeof _var_12 === "object" ? _var_12.map(x => x) : _var_12);
}
let _var_13 = _stack.pop();
function _id_Strs() {
_stack.push(typeof _var_13 === "object" ? _var_13.map(x => x) : _var_13);
}
_id_Strs();
_id__35();
_stack.push(1);
_id__61();
if (_stack.pop()) {
_id_Strs();
_id__60_42();
}else {
_id_Strs();
_id__60_42();
_id_Sep();
_id__43_43();
_id_Strs();
_id__42_62_62();
_id_Sep();
_id_Join();
_id__43_43();
}
}
function _id_Words() {
_stack.push([" "]);
_id_String()._id_Split();
}
function _id_Unwords() {
_stack.push([" "]);
_id_String()._id_Join();
}
return {
_id_Split: _id_Split,
_id_Join: _id_Join,
_id_Words: _id_Words,
_id_Unwords: _id_Unwords,
}
}
function _id_Solve() {
_id_String()._id_Words();
_stack.push(4);
_id_Take();
_id_String()._id_Unwords();
}
_stack.push(["H","e","l","l","o"," ","h","o","w"," ","a","r","e"," ","y","o","u"," "," "," "," ","C","o","n","t","e","s","t","a","n","t"]);
_id_Solve();
_id__60_63();
