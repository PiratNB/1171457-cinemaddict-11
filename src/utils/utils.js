export const getRandomElementOfArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomizedReducedArray = (arr, count) => {
  return arr.slice(0).sort(() => Math.random() - 0.5).slice(0, count);
};
