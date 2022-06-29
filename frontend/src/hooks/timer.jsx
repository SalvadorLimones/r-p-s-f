export const timer = (value) => {
  let timeLeft = value;

  const loop = () => {
    setInterval(() => {
      timeLeft = timeLeft - 1;
    }, 1000);
  };
  const id = loop();

  if (timeLeft === 0) {
    clearInterval(id);
  }
  return timeLeft;
};
