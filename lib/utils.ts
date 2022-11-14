import fractionUnicode from 'fraction-unicode';
import { fraction } from 'mathjs';

interface Enum {
  [id: string]: string | number;
}

export const inEnum = (e: Enum, value: string | number) =>
  Object.values(e).includes(value);

export const toFraction = (decimal: number) => {
  if (decimal % 1 === 0) return decimal.toString();
  const { n, d } = fraction(decimal);
  return fractionUnicode(n, d);
};
