export const ALPHABET = [
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
];

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Maximum selector limit in IE10
const LIMIT_COUNT = 2 ** 16;

function Uglify(availableCharacters, isAvailableString) {
  const maxIndex = availableCharacters.length;
  let count = 0;
  let keys = [0];
  let set = {};

  return function (name) {
    for (; !set[name]; ++count) {
      const str = keys.map((key) => availableCharacters[key]).join("");
      if (!isAvailableString || isAvailableString(str)) {
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
      if (count === LIMIT_COUNT) {
        count = 0;
        keys = [0];
        set = {};
      }
    }
    return set[name];
  };
}

const CSS_CHARACTERS = [
  ...NUMBERS,
  ...ALPHABET,
  // https://www.w3.org/TR/CSS22/syndata.html#characters
  "-",
  "_",
];

function validateCss(str) {
  return (
    str.slice(0, 2) !== "--" &&
    !NUMBERS.includes(str[0]) &&
    !(str[0] === "-" && NUMBERS.includes(str[1]))
  );
}

export function CssUglify() {
  return Uglify(CSS_CHARACTERS, validateCss);
}
