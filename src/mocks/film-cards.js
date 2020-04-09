import {getRandomElementOfArray, getRandomizedReducedArray} from "../utils";

const FILM_NAMES = [
  `Made for Each Other`,
  `Popeye Meets Sinbad`,
  `Sagebrush Trail`,
  `Santa Claus Conquers the Martians`,
  `The Dance of Life`,
  `The Great Flamarion`,
  `The Man with the Golden Arm`
];
const POSTER_IMAGES = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];
const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];
const DIRECTOR_NAMES = [
  `Anthony Mann`,
  `Steven Spielberg`,
  `Martin Scorsese`,
  `Alfred Hitchcock`,
  `Stanley Kubrick`,
  `Quentin Tarantino`,
  `Francis Ford Coppola`,
  `Ridley Scott`,
  `Woody Allen`
];
const WRITER_NAMES = [
  `Quentin Tarantino`,
  `Christopher Nolan`,
  `Joel Coen`,
  `Michael Mann`,
  `Frank Darabont`,
  `Sergio Leone`,
  `Wes Anderson`,
  `Martin Scorsese`,
  `Damien Chazelle`,
  `Drew Goddard`
];
const ACTOR_NAMES = [
  `Jack Nicholson`,
  `Ralph Fiennes`,
  `Daniel Day-Lewis`,
  `Robert De Niro`,
  `Al Pacino`,
  `Dustin Hoffman`,
  `Tom Hanks`,
  `Brad Pitt`,
  `Anthony Hopkins`,
  `Marlon Brando`,
  `Jeremy Irons`,
  `Denzel Washington`,
  `Gene Hackman`,
  `Jeff Bridges`,
  `Tim Robbins`,
  `Henry Fonda`,
  `William Hurt`,
  `Kevin Costner`,
  `Clint Eastwood`,
  `Leonardo DiCaprio`
];
const COUNTRIES = [
  `USA`,
  `India`,
  `France`,
  `Canada`,
  `Russia`,
  `UK`
];
const GENRES = [
  `Drama`,
  `Mystery`,
  `Comedy`,
  `Western`,
  `Musical`,
  `Cartoon`,
  `Horror`,
  `Adventure`,
  `Fantasy`,
  `Science fiction`
];
const COMMENT_EMOTIONS = [`angry`, `puke`, `sleeping`, `smile`];
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
