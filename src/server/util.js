/**
 * This method will normalize an index base on the length given
 * e.g for index "-1" and length "5", it will return "4", which is the index of last item
 * @return {Number} - a normalized index
 */
function normalize(length, index) {
  if (index < 0) return index + length;
  if (length > 0 && index > (length - 1)) return index % length;
  return index;
}

/**
 * @return {Number} - color in decimal format
 */
function randomColor() {
  return Math.floor(Math.random() * 16777216);
}

module.exports = {
  normalize,
  randomColor
};
