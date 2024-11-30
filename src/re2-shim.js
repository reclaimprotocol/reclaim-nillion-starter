// This is a shim to fix the issue with the attestor-core package (RE2 is a native module and cannot be used in the browser)
const RE2 = undefined;

console.log(Object.keys(RE2)) 

export default RE2;