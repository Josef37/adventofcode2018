function simulate(input) {
  const values = [];
  const register = [input].concat(Array(5).fill(0));
  do {
    register[3] = register[4] | (2 ** 16);
    register[4] = 707129;

    register[4] = calcR4(register[3], register[4]);
    while (256 <= register[3]) {
      register[3] = Math.floor(register[3] / 256);
      register[4] = calcR4(register[3], register[4]);
    }
    if (values.includes(register[4])) {
      const firstIndex = values.indexOf(register[4]);
      console.log(
        `Cycle with ${register[4]}. First encountered at index ${firstIndex}.`
      );
      return values[values.length - 1];
    }
    values.push(register[4]);
  } while (register[4] !== register[0]);

  function calcR4(r3, r4) {
    return ((r4 + (r3 % 256)) * 65899) % 16777216;
  }
}

console.log(simulate(0));
