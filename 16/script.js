const fs = require("fs");

class Instruction {
  static addr(register, a, b, c) {
    register = register.slice();
    register[c] = register[a] + register[b];
    return register;
  }

  static addi(register, a, b, c) {
    register = register.slice();
    register[c] = register[a] + b;
    return register;
  }

  static mulr(register, a, b, c) {
    register = register.slice();
    register[c] = register[a] * register[b];
    return register;
  }

  static muli(register, a, b, c) {
    register = register.slice();
    register[c] = register[a] * b;
    return register;
  }

  static banr(register, a, b, c) {
    register = register.slice();
    register[c] = register[a] & register[b];
    return register;
  }

  static bani(register, a, b, c) {
    register = register.slice();
    register[c] = register[a] & b;
    return register;
  }

  static borr(register, a, b, c) {
    register = register.slice();
    register[c] = register[a] | register[b];
    return register;
  }

  static bori(register, a, b, c) {
    register = register.slice();
    register[c] = register[a] | b;
    return register;
  }

  static setr(register, a, b, c) {
    register = register.slice();
    register[c] = register[a];
    return register;
  }

  static seti(register, a, b, c) {
    register = register.slice();
    register[c] = a;
    return register;
  }

  static gtir(register, a, b, c) {
    register = register.slice();
    register[c] = Number(a > register[b]);
    return register;
  }

  static gtri(register, a, b, c) {
    register = register.slice();
    register[c] = Number(register[a] > b);
    return register;
  }

  static gtrr(register, a, b, c) {
    register = register.slice();
    register[c] = Number(register[a] > register[b]);
    return register;
  }

  static eqir(register, a, b, c) {
    register = register.slice();
    register[c] = Number(a === register[b]);
    return register;
  }

  static eqri(register, a, b, c) {
    register = register.slice();
    register[c] = Number(register[a] === b);
    return register;
  }

  static eqrr(register, a, b, c) {
    register = register.slice();
    register[c] = Number(register[a] === register[b]);
    return register;
  }
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function answer(path) {
  const data = fs.readFileSync(path, { encoding: "utf8" });
  const inputs = data
    .match(/(?<=Before: \[).*?(?=\]\n)/g)
    .map(input => input.split(",").map(Number));
  const outputs = data
    .match(/(?<=After:  \[).*?(?=\]\n)/g)
    .map(input => input.split(",").map(Number));
  const instructions = data
    .match(/(\d+ ){3}\d+(?=\n)/g)
    .map(input => input.split(" ").map(Number));
  const functions = Object.getOwnPropertyNames(Instruction)
    .filter(prop => typeof Instruction[prop] === "function")
    .map(propName => Instruction[propName]);

  let possibleFunctionsForOpcodes = Array(16)
    .fill()
    .map(() => functions.slice());

  let index = 0;
  for (; index < inputs.length; index++) {
    const input = inputs[index];
    const expected = outputs[index];
    const instruction = instructions[index];

    const possibleFunctions = possibleFunctionsForOpcodes[instruction[0]];
    possibleFunctionsForOpcodes[instruction[0]] = possibleFunctions.filter(
      func => {
        const output = func(input, ...instruction.slice(1));
        return arraysEqual(output, expected);
      }
    );
  }

  const functionForOpcode = Array(16).fill();

  while (
    possibleFunctionsForOpcodes.filter(functions => functions.length > 0).length
  ) {
    const opcodeWithOneFunction = possibleFunctionsForOpcodes.filter(
      (functions, index) => {
        if (functions.length === 1) {
          functionForOpcode[index] = functions[0];
          return true;
        }
      }
    );

    opcodeWithOneFunction.forEach(functions => {
      const certainFunction = functions[0];
      possibleFunctionsForOpcodes = possibleFunctionsForOpcodes.map(functions =>
        functions.filter(func => func !== certainFunction)
      );
    });
  }

  let register = [1, 1, 0, 3];
  for (; index < instructions.length; index++) {
    const instruction = instructions[index];
    register = functionForOpcode[instruction[0]](
      register,
      ...instruction.slice(1)
    );
  }
  console.log(register);
}

answer(__dirname + "/input");
