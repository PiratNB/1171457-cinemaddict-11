const FILMS_COUNT = 30;
const FILMS_TO_RENDER = 5;
const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;

import {createProfileUserTemplate} from "./components/profile-user.js";
import {createNavigationTemplate} from "./components/navigation.js";
import {createSortTemplate} from "./components/sort.js";
import {createFilmsListTemplate} from "./components/film-list.js";
import {createFilmCard} from "./components/film-card.js";
import {createBtnShowMoreTemplate} from "./components/btn-show-more.js";
import {createTopRatedMostCommentedTemplate} from "./components/rate-commented.js";
import {createFooterStatisticsTemplate} from "./components/footer-statistics.js";
import {createFilmDetailsTemplate} from "./components/film-details.js";
import {renderElement} from "./utils";
import {generateFilmBase} from "./mocks/film-cards";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

renderElement(siteHeaderElement, createProfileUserTemplate()); // Рендер имени пользователя
renderElement(siteMainElement, createNavigationTemplate()); // Рендер главного меню
renderElement(siteMainElement, createSortTemplate()); // Рендер панели сортировки
renderElement(siteMainElement, createFilmsListTemplate()); // Рендер секции с фильмами

// Рендер всех фильмов
const films = generateFilmBase(FILMS_COUNT);

const filmListContainerElement = siteMainElement.querySelector(`.films-list__container`);

films.slice(0, FILMS_TO_RENDER).forEach((it) => {
  renderElement(filmListContainerElement, createFilmCard(it)); // Рендер карточек фильмов
});

const filmListElement = siteMainElement.querySelector(`.films-list`);

renderElement(filmListElement, createBtnShowMoreTemplate()); // Рендер кнопки Loadmore

const filmsElement = siteMainElement.querySelector(`.films`);

renderElement(filmsElement, createTopRatedMostCommentedTemplate()); // Рендер секции с самыми популярными и комментируемыми фильмами

const topRatedElement = filmsElement.querySelector(`.top-rated`);

for (let i = 0; i < TOP_RATED_COUNT; i++) {
  renderElement(topRatedElement, createFilmCard(films[0])); // Рендео самых популярных фильмов
}

const mostCommentedElement = filmsElement.querySelector(`.most-commented`);

for (let i = 0; i < MOST_COMMENTED_COUNT; i++) {
  renderElement(mostCommentedElement, createFilmCard(films[0])); // Рендер самых комментируемых фильмов
}

const siteFooter = document.querySelector(`.footer`);
const siteFooterStat = siteFooter.querySelector(`.footer__statistics`);
renderElement(siteFooterStat, createFooterStatisticsTemplate()); // Рендер статистики
// renderElement(siteFooter, createFilmDetailsTemplate(), `afterend`); // Рендер карточки фильма попап
