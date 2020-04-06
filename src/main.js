const FILM_COUNT = 5;
const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;

import {createProfileUserTemplate} from "./components/profile-user.js";
import {createNavigationTemplate} from "./components/navigation.js";
import {createSortTemplate} from "./components/sort.js";
import {createFilmsListTemplate} from "./components/film-list.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createBtnShowMoreTemplate} from "./components/btn-show-more.js";
import {createTopRatedMostCommentedTemplate} from "./components/rate-commented.js";
import {createFooterStatisticsTemplate} from "./components/footer-statistics.js";
import {createFilmDetailsTemplate} from "./components/film-details.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createProfileUserTemplate(), `beforeend`);
render(siteMainElement, createNavigationTemplate(), `beforeend`);
render(siteMainElement, createSortTemplate(), `beforeend`);
render(siteMainElement, createFilmsListTemplate(), `beforeend`);

const filmListContainerElement = siteMainElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_COUNT; i++) {
  render(filmListContainerElement, createFilmCardTemplate(), `beforeend`);
}

const filmListElement = siteMainElement.querySelector(`.films-list`);

render(filmListElement, createBtnShowMoreTemplate(), `beforeend`);

const filmsElement = siteMainElement.querySelector(`.films`);

render(filmsElement, createTopRatedMostCommentedTemplate(), `beforeend`);

const topRatedElement = filmsElement.querySelector(`.top-rated`);

for (let i = 0; i < TOP_RATED_COUNT; i++) {
  render(topRatedElement, createFilmCardTemplate(), `beforeend`);
}

const mostCommentedElement = filmsElement.querySelector(`.most-commented`);

for (let i = 0; i < MOST_COMMENTED_COUNT; i++) {
  render(mostCommentedElement, createFilmCardTemplate(), `beforeend`);
}

const siteFooter = document.querySelector(`.footer`);
const siteFooterStat = siteFooter.querySelector(`.footer__statistics`);
render(siteFooterStat, createFooterStatisticsTemplate(), `beforeend`);
render(siteFooter, createFilmDetailsTemplate(), `afterend`);
