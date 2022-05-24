import { isNumberString } from 'class-validator';

export function unknownToNumber(value: unknown): number | unknown {
  return isNumberString(value) ? Number(value) : value;
}
