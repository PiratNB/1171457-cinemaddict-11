import FilmStat from "./components/film-stat";
import {renderElement} from "./utils/render";
import PageController from "./controllers/page-controller";
import MoviesModel from "./models/movies";
import Statistics from "./components/statistics";
import API from "./api";

const AUTHORIZATION = `Basic dCFVfgwHGbTnHBUgy`;
const api = new API(AUTHORIZATION);

const mainContainer = document.querySelector(`main.main`);
const moviesModel = new MoviesModel();

const pageController = new PageController(mainContainer, moviesModel, api);

const statistics = new Statistics(moviesModel);


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

api.getFilms()
  .then((films) => {
    moviesModel.setMovies(films);

    pageController.render();

    renderElement(mainContainer, statistics);
    statistics.hide();

    renderElement(document.querySelector(`.footer__statistics`), new FilmStat(films.length));
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});
