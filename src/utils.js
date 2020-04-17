export const getRandomElementOfArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomizedReducedArray = (arr, count) => {
  return arr.slice(0).sort(() => Math.random() - 0.5).slice(0, count);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

export const renderElement = (container, element, place = `beforeend`) => {
  switch (place) {
    case `beforeend`:
      container.append(element);
      break;
    case `afterbegin`:
      container.prepend(element);
      break;
  }
};
