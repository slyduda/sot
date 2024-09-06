import { unref, isRef } from "@vue/reactivity";

const isObject = (val: any) => val !== null && typeof val === "object";
const isArray = Array.isArray;

/**
 * Deeply unref a value, recursing into objects and arrays.
 *
 * @param {Mixed} val - The value to deeply unref.
 *
 * @return {Mixed}
 */
const deepUnref = (val: any) => {
  const checkedVal = isRef(val) ? unref(val) : val;

  if (!isObject(checkedVal)) {
    return checkedVal;
  }

  if (isArray(checkedVal)) {
    return unrefArray(checkedVal);
  }

  return unrefObject(checkedVal);
};

/**
 * Unref a value, recursing into it if it's an object.
 *
 * @param {Mixed} val - The value to unref.
 *
 * @return {Mixed}
 */
const smartUnref = (val: any) => {
  // Non-ref object?  Go deeper!
  if (val !== null && !isRef(val) && typeof val === "object") {
    return deepUnref(val);
  }

  return unref(val);
};

/**
 * Unref an array, recursively.
 *
 * @param {Array} arr - The array to unref.
 *
 * @return {Array}
 */
const unrefArray = (arr: any) => arr.map(smartUnref);

/**
 * Unref an object, recursively.
 *
 * @param {Object} obj - The object to unref.
 *
 * @return {Object}
 */
function unrefObject<T extends object>(obj: T): T {
  const unreffed = {} as { [K in keyof T]: T[K] };

  Object.keys(obj).forEach((key) => {
    // Cast `key` to `keyof T` and then use it to access both `obj` and `unreffed`
    const typedKey = key as keyof T;
    unreffed[typedKey] = smartUnref(obj[typedKey]);
  });

  return unreffed;
}

export { deepUnref };
