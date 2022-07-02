export const randomClassName = (position) => {
  let random = Math.floor(Math.random() * 2) + 1;
  return "background-" + position + "-" + random;
};
