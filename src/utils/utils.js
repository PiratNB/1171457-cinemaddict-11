import {FILTER_TYPE} from "../mocks/consts";

export const getRandomElementOfArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomizedReducedArray = (arr, count) => {
  return arr.slice(0).sort(() => Math.random() - 0.5).slice(0, count);
};

export const capitalizeFirstLetter = (string) => {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
};

export const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FILTER_TYPE.WATCHLIST:
      return films.filter((it) => it.isAtWatchlist);
    case FILTER_TYPE.HISTORY:
      return films.filter((it) => it.isWatched);
    case FILTER_TYPE.FAVORITES:
      return films.filter((it) => it.isFavorite);
    default:
      return films;
  }
};
