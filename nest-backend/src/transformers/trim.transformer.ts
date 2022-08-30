import { TransformFnParams } from 'class-transformer';

export function trim({ value }: TransformFnParams) {
  if (value && typeof value === 'string') {
    return value.trim();
  }
  return value;
}
