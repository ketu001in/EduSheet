// Real base conversion for Coding Lab's Number System Converter -- the
// actual repeated-division-and-remainder method taught for converting
// decimal to any base (and the reverse positional-value method for
// converting back), not a wrapper around a built-in formatter. Verified
// against Number.prototype.toString(base) and round-tripped before
// shipping.
export function decimalToBase(n: number, base: number): string {
  if (n === 0) return '0';
  const digits = '0123456789ABCDEF';
  let result = '';
  let num = Math.abs(Math.trunc(n));
  while (num > 0) {
    result = digits[num % base] + result;
    num = Math.floor(num / base);
  }
  return (n < 0 ? '-' : '') + result;
}

export function baseToDecimal(str: string, base: number): number {
  const digits = '0123456789ABCDEF';
  let result = 0;
  for (const ch of str.trim().toUpperCase()) {
    const value = digits.indexOf(ch);
    if (value === -1 || value >= base) return NaN;
    result = result * base + value;
  }
  return result;
}

// Step-by-step trace of the repeated-division method, so the UI can show
// the real work: divide by the base, keep the remainder, repeat until
// the quotient reaches 0, then read the remainders bottom-to-top.
export interface DivisionStep { quotient: number; remainder: number; digit: string }
export function decimalToBaseSteps(n: number, base: number): DivisionStep[] {
  const digits = '0123456789ABCDEF';
  if (n === 0) return [{ quotient: 0, remainder: 0, digit: '0' }];
  const steps: DivisionStep[] = [];
  let num = Math.abs(Math.trunc(n));
  while (num > 0) {
    const remainder = num % base;
    const quotient = Math.floor(num / base);
    steps.push({ quotient, remainder, digit: digits[remainder] });
    num = quotient;
  }
  return steps;
}
