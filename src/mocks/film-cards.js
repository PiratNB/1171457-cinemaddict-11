import {getRandomElementOfArray, getRandomizedReducedArray} from "../utils/utils";
import {DESCRIPTIONS, COMMENT_EMOTIONS, ACTOR_NAMES, GENRES, COUNTRIES, WRITER_NAMES, DIRECTOR_NAMES, FILM_NAMES, POSTER_IMAGES} from "./consts";

const MILLISECONDS_IN_YEAR = 1000 * 60 * 60 * 24 * 30 * 12;

const generateRandomComment = () => {
  return {
    message: getRandomElementOfArray(DESCRIPTIONS),
    emotion: getRandomElementOfArray(COMMENT_EMOTIONS),
    author: getRandomElementOfArray(ACTOR_NAMES),
    postDate: Date.now() - Math.round(Math.random() * MILLISECONDS_IN_YEAR)
  };
};

const generateComments = (count) => {
  const comments = [];
  for (let i = 0; i < count; i++) {
    comments.push(generateRandomComment());
  }
  return comments.sort((a, b) => a.postDate - b.postDate);
};

const generateRandomFilm = () => {
  const filmName = getRandomElementOfArray(FILM_NAMES);
  return {
    id: String(Math.round(Date.now() * Math.random())),
    name: filmName,
    posterImage: getRandomElementOfArray(POSTER_IMAGES),
    rating: Math.round(Math.random() * 100) / 10,
    originalName: filmName,
    director: getRandomElementOfArray(DIRECTOR_NAMES),
    writers: getRandomizedReducedArray(WRITER_NAMES, Math.ceil(Math.random() * 3)),
    actors: getRandomizedReducedArray(ACTOR_NAMES, Math.ceil(Math.random() * 5) + 5),
    releaseDate: Date.now() - Math.round(Math.random() * 50 * MILLISECONDS_IN_YEAR),
    runtime: Math.ceil(Math.random() * 180) + 60,
    country: getRandomElementOfArray(COUNTRIES),
    genres: getRandomizedReducedArray(GENRES, Math.ceil(Math.random() * 3)),
    description: getRandomizedReducedArray(DESCRIPTIONS, Math.ceil(Math.random() * 5)).join(` `),
    ageRating: Math.round(Math.random() * 21),
    comments: generateComments(Math.round(Math.random() * 5)),
    isFavorite: Math.random() > 0.5,
    isAtWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5
  };
};

export const generateMovieBase = (filmsCount) => {
  const films = [];
  for (let i = 0; i < filmsCount; i++) {
    films.push(generateRandomFilm());
  }
  return films;
};
