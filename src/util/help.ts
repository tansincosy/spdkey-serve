export type Edge<T> = {
  node: T;
  cursor: string;
};
export function secretMask(cc: string, num = 4, mask = '*'): string {
  return cc.slice(-num).padStart(cc.length, mask);
}

export function JSON2Object<T>(jsonStringy: string, defaultValue = {}): T {
  try {
    defaultValue = JSON.parse(jsonStringy);
  } catch (error) {}

  return defaultValue as T;
}

export function randomTimeStampSeconds(min: number, max: number) {
  return parseInt(Math.random() * (max - min) + min + '');
}

export function hasPreviousPage<T>(
  allEdges: Edge<T>[],
  after: string,
  last: number,
): boolean {
  if (last) {
    return allEdges.length > last;
  }
  if (after) {
    return allEdges.length > 0;
  }
  return false;
}

export function hasNextPage<T>(
  allEdges: Edge<T>[],
  before: string,
  first: number,
): boolean {
  if (first) {
    return allEdges.length > first;
  }
  if (before) {
    return allEdges.length > 0;
  }
  return false;
}
