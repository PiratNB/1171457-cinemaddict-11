const FILMS_COUNT = Math.round(Math.random() * 500);

import FilmStat from "./components/film-stat";
import {renderElement} from "./utils/render";
import {generateMovieBase} from "./mocks/film-cards";
import PageController from "./controllers/page-controller";
import MoviesModel from "./models/movies";
import Statistics from "./components/statistics";

const films = generateMovieBase(FILMS_COUNT);

renderElement(document.querySelector(`.footer__statistics`), new FilmStat(films)); // Рендер общего кол-ва фильмов
const mainContainer = document.querySelector(`main.main`);

const moviesModel = new MoviesModel();
moviesModel.setMovies(films);
const pageController = new PageController(mainContainer, moviesModel);
pageController.render();

const statistics = new Statistics(moviesModel);
renderElement(mainContainer, statistics);
statistics.hide();

mainContainer.addEventListener(`click`, (evt) => {
  switch (true) {
    case evt.target.classList.contains(`main-navigation__additional`):
      pageController.hide();
      mainContainer.querySelector(`ul.sort`).classList.add(`visually-hidden`);
      statistics.show();
      break;
    case evt.target.classList.contains(`main-navigation__item`):
      mainContainer.querySelector(`ul.sort`).classList.remove(`visually-hidden`);
      pageController.show();
      statistics.hide();
      break;
  }
});

