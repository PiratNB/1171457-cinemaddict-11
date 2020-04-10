import {getRandomElementOfArray, getRandomizedReducedArray} from "../utils";
import {DESCRIPTIONS, COMMENT_EMOTIONS, ACTOR_NAMES, GENRES, COUNTRIES, WRITER_NAMES, DIRECTOR_NAMES, FILM_NAMES, POSTER_IMAGES} from "./consts";

const millisecondsInYear = 1000 * 60 * 60 * 24 * 30 * 12;

const generateRandomComment = () => {
  return {
    message: getRandomElementOfArray(DESCRIPTIONS),
    emotion: getRandomElementOfArray(COMMENT_EMOTIONS),
    author: getRandomElementOfArray(ACTOR_NAMES),
    postDate: Date.now() - Math.round(Math.random() * millisecondsInYear)
  };
};

const generateComments = (count) => {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push(generateRandomComment());
  }
  return comments;
};

const generateRandomFilm = () => {
  const filmName = getRandomElementOfArray(FILM_NAMES);
  return {
    name: filmName,
    posterImage: getRandomElementOfArray(POSTER_IMAGES),
    rating: Math.round(Math.random() * 100) / 10,
    originalName: filmName,
    director: getRandomElementOfArray(DIRECTOR_NAMES),
    writers: getRandomizedReducedArray(WRITER_NAMES, Math.ceil(Math.random() * 3)),
    actors: getRandomizedReducedArray(ACTOR_NAMES, Math.ceil(Math.random() * 5) + 5),
    releaseDate: Date.now() - Math.round(Math.random() * 50 * millisecondsInYear),
    runtime: `${Math.ceil(Math.random() * 3)}h ${Math.round(Math.random() * 59)}m`,
    country: getRandomElementOfArray(COUNTRIES),
    genres: getRandomizedReducedArray(GENRES, Math.ceil(Math.random() * 3)),
    description: getRandomizedReducedArray(DESCRIPTIONS, Math.ceil(Math.random() * 5)).join(` `),
    ageRating: Math.round(Math.random() * 21),
    comments: generateComments(Math.round(Math.random() * 5)),
    isFavorite: Boolean(Math.round(Math.random())),
    isAtWatchlist: Boolean(Math.round(Math.random())),
    isWatched: Boolean(Math.round(Math.random()))
  };
};

export const generateFilmBase = (filmsCount) => {
  const films = [];
  for (let i = 0; i < filmsCount; i++) {
    films.push(generateRandomFilm());
  }
  return films;
};

export {COMMENT_EMOTIONS};
