export function withDefault<T>(val: T | undefined, defaultValue: T): T {
  if (val === undefined) return defaultValue;
  return val;
}

export function assertIfNull<T>(val: T | undefined, name: string): T {
  if (!val) throw new Error(`${name} is required`);
  return val;
}
