export function areSame<T>(left: T, right: T): boolean {
  switch (typeof left) {
    case "bigint":
    case "boolean":
    case "function":
    case "number":
    case "string":
      return false;

    default:
      return left === right;
  }
}