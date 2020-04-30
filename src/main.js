const FILMS_COUNT = Math.round(Math.random() * 500);

import ProfileUser from "./components/profile-user";
import FilmStat from "./components/film-stat";
import {renderElement} from "./utils/render";
import {generateMovieBase} from "./mocks/film-cards";
import PageController from "./controllers/page-controller";
import MoviesModel from "./models/movies";

const films = generateMovieBase(FILMS_COUNT);

renderElement(document.querySelector(`header.header`), new ProfileUser(films.filter((it) => it.isWatched).length)); // Рендер статуса пользователя
renderElement(document.querySelector(`.footer__statistics`), new FilmStat(films)); // Рендер общего кол-ва фильмов
const mainContainer = document.querySelector(`main.main`);

const moviesModel = new MoviesModel();
moviesModel.setMovies(films);
const pageController = new PageController(mainContainer, moviesModel);
pageController.render();
