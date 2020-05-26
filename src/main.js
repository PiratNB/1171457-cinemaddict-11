import FilmStat from "./components/film-stat";
import {renderElement} from "./utils/render";
import PageController from "./controllers/page-controller";
import MoviesModel from "./models/movies";
import Statistics from "./components/statistics";
import API from "./api/api";
import Provider from "./api/provider";
import Store from "./api/store";

const STORE_VER = `v1`;
const FILM_STORE_PREFIX = `cinemaaddict-localstorage-films`;
const FILM_STORE_NAME = `${FILM_STORE_PREFIX}-${STORE_VER}`;
const COMMENTS_STORE_PREFIX = `cinemaaddict-localstorage-comments`;
const COMMENTS_STORE_NAME = `${COMMENTS_STORE_PREFIX}-${STORE_VER}`;
const AUTHORIZATION = `Basic dCFvgBHnjDDkjnHBUgy`;
const api = new API(AUTHORIZATION);
const filmStore = new Store(FILM_STORE_NAME, window.localStorage);
const commentsStore = new Store(COMMENTS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, filmStore, commentsStore);

const mainContainer = document.querySelector(`main.main`);
const moviesModel = new MoviesModel();

const pageController = new PageController(mainContainer, moviesModel, apiWithProvider);

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

apiWithProvider.getFilms()
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

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
