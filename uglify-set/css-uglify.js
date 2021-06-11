function Mangle(characters, validate) {
  const maxIndex = characters.length;
  let keys = [0];
  let set = {};

  return function (name) {
    while (!set[name]) {
      const str = keys.map((key) => characters[key]).join("");
      if (validate(str)) {
        set[name] = str;
      }
      ++keys[0];
      keys.forEach((key, index) => {
        if (key === maxIndex) {
          const nextIndex = index + 1;
          keys[index] = 0;
          if (keys[nextIndex] === undefined) {
            keys.push(0);
          } else {
            ++keys[nextIndex];
          }
        }
      });
    }
    return set[name];
  };
}

function CssMangle() {
  return Mangle(
    [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "-",
      "_",
    ],
    (str) =>
      str.slice(0, 2) !== "--" &&
      !NUMBERS.includes(str[0]) &&
      !(str[0] === "-" && NUMBERS.includes(str[1]))
  );
}
