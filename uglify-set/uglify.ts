// Maximum selector limit in IE10
const LIMIT_COUNT = 2 ** 16;

export type UglifyFunction = (name: string) => string;

export function Uglify(
  availableCharacters: string[],
  isAvailableString?: (str: string) => boolean,
): UglifyFunction {
  const maxIndex = availableCharacters.length;
  let count = 0;
  let keys = [0];
  let set: { [key: string]: string } = {};

  return function(name: string): string {
    for (; !set[name]; ++count) {
      const str = (
        keys
          .map((key) => availableCharacters[key])
          .join('')
      );
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
