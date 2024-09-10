export * from "./hashPassword";
export * from "./fetchHelpers";
export * from "./random";
export const sum = (a: number, b: number): number => {
  return a + b;
};

export function normalizeArray<U>(value: U | U[]): U[] {
  return Array.isArray(value) ? value : [value];
}
