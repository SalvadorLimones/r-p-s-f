export const randomClassName = (position) => {
  let random = Math.floor(Math.random() * 2) + 1;
  console.log("RANDOM:", random);
  return "background-" + position + "-" + random;
};
