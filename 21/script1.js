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

answer(__dirname + "/input");

function answer(path) {
  const { pointer, instructions } = parseData(path);
  let register = [0].concat(Array(5).fill(0));
  let count = 0;
  while (0 <= register[pointer] && register[pointer] < instructions.length) {
    const { instruction, abc } = instructions[register[pointer]];
    const oldRegister = register;
    register = Instruction[instruction](register, ...abc);
    console.log(oldRegister/*  + "\n" + [instruction, ...abc].join(" ") + "\n" + register + "\n" */);
    register[pointer]++;
    count++;
  }
  console.log(count);
}

function parseData(path) {
  const data = fs.readFileSync(path, { encoding: "utf8" });
  const lines = data.split("\n");
  const pointer = Number(lines.shift().match(/\d+/)[0]);
  const instructions = lines
    .map(line => /(?<instruction>\w+) (?<abc>.*)/.exec(line).groups)
    .map(({ instruction, abc }) => ({
      instruction,
      abc: abc.split(" ").map(Number)
    }));
  return { pointer, instructions };
}
