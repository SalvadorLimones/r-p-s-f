export const randomClassName = (type, value, count) => {
  let random = Math.floor(Math.random() * 2) + count - 1;
  return type + "-" + value + "-" + random;
};
