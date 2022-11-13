interface Enum {
  [id: string]: string | number;
}

export const inEnum = (e: Enum, value: string | number) =>
  Object.values(e).includes(value);

const gcd = (a: number, b: number): number => {
  if (b < 0.0000001) return a;

  return gcd(b, Math.floor(a % b));
};

export const toFraction = (decimal: number) => {
  const len = decimal.toString().length - 2;
  const denominator = Math.pow(10, len);
  const numerator = decimal * denominator;
  const divisor = gcd(numerator, denominator);

  return (
    Math.floor(numerator / divisor) + '/' + Math.floor(denominator / divisor)
  );
};
