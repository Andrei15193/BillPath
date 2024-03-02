import { useRef } from "react";

export function useArrayCache<T extends readonly unknown[] | null | undefined>(array: T): T {
  const cache = useRef<T>(array);

  if (arraysDiffer(cache.current, array))
    cache.current = array;

  return cache.current;
}

function arraysDiffer(left: readonly unknown[] | null | undefined, right : readonly unknown[] | null | undefined): boolean {
  let hasDifference: boolean;
  if (left === null || left === undefined)
    hasDifference = right !== null && right !== undefined;
  else if (right !== null && right !== undefined) {
    hasDifference = left.length !== right.length;

    let index = 0;
    while (!hasDifference && index < left.length) {
      hasDifference = left[index] !== right[index];
      index++;
    }
  }
  else
    hasDifference = false;


  return hasDifference;
}