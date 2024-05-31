import re
import sys

from lark import Token, Tree
from grp_parser import parser

# NUMBER
def compile_number(code, value):
  code += f"_stack.push({value});\n"
  return code

# STRING
def compile_string(code, value):
  value = value[1:-1]
  new = []
  for c in value:
    new.append(f'"{c}"')
  new = ",".join(new)
  code += f"_stack.push([{new}]);\n"
  return code

# CHARACTER
def compile_character(code, value):
  value = value[1:-1]
  code += f"_stack.push('{value}');\n"
  return code

var_counter = -1
def var_count(num=1):
  global var_counter
  results = []
  for _ in range(num):
    var_counter += 1
    results.append(f"_var_{var_counter}")
  return results[0] if num == 1 else tuple(results)

# CONVERT IDENTIFIER
def convert_identifier(name):
  id = ""
  for char in str(name):
    if char in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ":
      id += char
    else:
      id += f"_{ord(char)}"
  return id

# IDENTIFIER
def compile_identifier(code, value):
  code += f"_id_{convert_identifier(value)}();\n"
  return code

# ARRAY
def compile_array(code, *values):
  arr = var_count(1)
  code += f"let {arr} = [];\n"
  for v in values:
    code = compile_tree(code, v)
  code += f"for (let i = 0; i < {len(values)}; i++) {{\n"
  code += f"{arr}[{len(values) - 1}-i] = _stack.pop();\n"
  code += f"}}\n"
  code += f"_stack.push({arr});\n"
  return code

# ACCESS
def compile_access(code, module, method, deep=False):
  if method.data == "access":
    method = compile_access("", *method.children, deep=True)
  else:
    method = convert_identifier(method.children[0])
  code += f"_id_{module}()._id_{method}"
  if not deep:
    code += "();\n"
  return code

# SYMBOL
def compile_symbol(code, name):
  symb = var_count(1)
  code += f"let {symb} = _stack.pop();\n"
  code += f"function _id_{name}() {{\n"
  code += f"_stack.push(typeof {symb} === \"object\" ? {symb}.map(x => x) : {symb});\n"
  code += f"}}\n"
  return code

# IF-ELSE
def compile_ifelse(code, true_case, *else_cases):
  s = "if (_stack.pop()) {\n"
  s += compile_tree("", true_case)
  s += "}"
  elif_cases = []
  for i, case in enumerate(else_cases):
    if i == len(else_cases) - 1:
      else_case = case
      break
    if i % 2 == 0:
      elif_cases.append((case, else_cases[i + 1]))
  for (cond, case) in elif_cases:
    cond = compile_tree("", cond)
    s += f" else if ((() => {{ {cond} return _stack.pop(); }})()) {{\n"
    s = compile_tree(s, case)
    s += f"}}"
    
  s += f"else {{\n"
  s = compile_tree(s, else_case)
  s += f"}}"
  code += s + "\n"
  return code

# COMBINATOR
def compile_combinator(code, *ops):
  s = "_invoke(["
  for i, op in enumerate(ops):
    if isinstance(op, Tree) and op.data in ["id_splice", "head_splice", "tail_splice"]:
      if op.data == "id_splice":
        s += op.children[0]
      elif op.data == "head_splice":
        s += f"{op.children[0]}[0]"
      elif op.data == "tail_splice":
        s += f"{op.children[0]}.slice(1)"
    elif isinstance(op, Tree) and op.data == "identifier":
      id = f"_id_{convert_identifier(op.children[0])}"
      s += f"[{id}]"
    else:
      f = "() => {\n"
      f = compile_tree(f, op)
      f += "}"
      s += f"[{f}]"
    if i < len(ops) - 1:
      s += ", "
  s += "].flat(5));\n"
  code += s
  return code

# EXPRESSION
def compile_expression(code, *terms):
  for t in terms:
    code = compile_tree(code, t)
  return code

# DECLARATION
def compile_declaration(code, name, body):
  name = name.children[0]
  code += f"function _id_{convert_identifier(name)}() {{\n"
  code = compile_tree(code, body)
  code += f"}}\n"
  return code

# MODULE
def compile_module(code, name, *decls):
  name = f"_id_{name}"
  s = f"function {name}() {{\n"
  for dec in decls:
    s = compile_tree(s, dec)
  s += "return {\n"
  for dec in decls:
    name = dec.children[0]
    name = f"_id_{name.children[0]}"
    s += f"{name}: {name},\n"
  s += "}\n"
  s += f"}}\n"
  code += s
  return code

# MACRO
def compile_macro(code, name, splice, body):
  name = name.children[0]
  splice = splice.children[0]
  code += f"function _id_{convert_identifier(name)}({splice}) {{\n"
  code = compile_tree(code, body)
  code += f"}}\n"
  return code

# PROGRAM
def compile_program(code, *terms):
  for t in terms:
    code = compile_tree(code, t)
  return code

# TREE
def compile_tree(code, tree):
  if tree.data == "number":
    return compile_number(code, *tree.children)
  if tree.data == "string":
    return compile_string(code, *tree.children)
  if tree.data == "character":
    return compile_character(code, *tree.children)
  if tree.data == "identifier":
    return compile_identifier(code, *tree.children)
  if tree.data == "array":
    return compile_array(code, *tree.children)
  if tree.data == "access":
    return compile_access(code, *tree.children)
  if tree.data == "symbol":
    return compile_symbol(code, *tree.children)
  if tree.data == "ifelse":
    return compile_ifelse(code, *tree.children)
  if tree.data == "combinator":
    return compile_combinator(code, *tree.children)
  if tree.data == "expression":
    return compile_expression(code, *tree.children)
  if tree.data == "declaration":
    return compile_declaration(code, *tree.children)
  if tree.data == "module":
    return compile_module(code, *tree.children)
  if tree.data == "macro":
    return compile_macro(code, *tree.children)
  if tree.data == "program":
    return compile_program(code, *tree.children)
  assert False, f"Not implemented: {tree.data}"
  
def compile(code):
  code = re.sub(r";.+", "", code)
  with open("lib.grp") as f:
    grplib = f.read()
  grplib = re.sub(r";.+", "", grplib)
  tree = parser.parse(grplib + "\n\n" + code)
  with open("lib.js") as f:
    lib = f.read()
  return compile_tree(lib, tree)

usage = "USAGE: python grp_transpiler.py INPUT_PATH OUTPUT_PATH\n"
usage+= "\nINPUT_PATH :: The path of the file you want to compile\n"
usage+= "OUTPUT_PATH :: The path of the transpiled javascript\n"

assert len(sys.argv) == 3, f"Invalid number of arguments provided\n{usage}"

grp_path = sys.argv[1]
js_path = sys.argv[2]

try:
  with open(grp_path) as f:
    code = f.read()
    js_code = compile(code)
except FileNotFoundError:
  with open(".".join(grp_path.split(".")[:-1]) + ".🍇") as f:
    code = f.read()
    js_code = compile(code)

with open(js_path, "w") as f:
  f.write(js_code)
