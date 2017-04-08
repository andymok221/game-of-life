export function integerToHexColor(number) {
  const hexStr = Number(number).toString(16); // if it is efff now
  const aux = '000000';
  return aux.substring(0, aux.length - hexStr.length) + hexStr; // it will be 00efff now
}