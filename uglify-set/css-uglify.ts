import { NUMBERS, ALPHABET } from './constant';
import { Uglify, UglifyFunction } from './uglify';

const CSS_CHARACTERS = [
  ...NUMBERS,
  ...ALPHABET,
  // https://www.w3.org/TR/CSS22/syndata.html#characters
  '-',
  '_',
];

function validateCss(str: string): boolean {
  return (
    str.slice(0, 2) !== '--' &&
    !NUMBERS.includes(str[0]) &&
    !(str[0] === '-' && NUMBERS.includes(str[1]))
  );
}

export function CssUglify(): UglifyFunction {
  return Uglify(CSS_CHARACTERS, validateCss);
}
