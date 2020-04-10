const FILMS_COUNT = 30;
const FILMS_TO_RENDER = 5;
const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;

import {createProfileUser} from "./components/profile-user";
import {createNavigation} from "./components/navigation";
import {createSort} from "./components/sort";
import {createFilmsList} from "./components/film-list";
import {createFilmCard} from "./components/film-card";
import {createBtnShowMore} from "./components/btn-show-more";
import {createTopRatedMostCommented} from "./components/rate-commented";
import {createFooterStatistics} from "./components/footer-statistics";
// import {createFilmDetails} from "./components/film-details";
import {renderElement} from "./utils";
import {generateFilmBase} from "./mocks/film-cards";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

renderElement(siteHeaderElement, createProfileUser()); // Рендер имени пользователя
renderElement(siteMainElement, createNavigation()); // Рендер главного меню
renderElement(siteMainElement, createSort()); // Рендер панели сортировки
renderElement(siteMainElement, createFilmsList()); // Рендер секции с фильмами
const filmsSection = siteMainElement.querySelector(`.films`);

const films = generateFilmBase(FILMS_COUNT);

// Рендер всех фильмов
const filmListContainerElement = siteMainElement.querySelector(`.films-list__container`);

films.slice(0, FILMS_TO_RENDER).forEach((it) => {
  renderElement(filmListContainerElement, createFilmCard(it)); // Рендер карточек фильмов
});

renderElement(filmsSection.querySelector(`.films-list`), createBtnShowMore()); // Рендер кнопки Loadmore

renderElement(filmsSection, createTopRatedMostCommented(), `afterend`); // Рендер секции с самыми популярными и комментируемыми фильмами

// Рендер Top rated фильмов
renderElement(filmsSection, createTopRatedMostCommented(`Top rated`));
renderElement(filmsSection, createTopRatedMostCommented(`Most commented`));
const topRatedFilmsListContainer = filmsSection.querySelectorAll(`.films-list--extra .films-list__container`)[0];
films.slice(0).sort((a, b) => b.rating - a.rating).slice(0, TOP_RATED_COUNT).forEach((it) => {
  renderElement(topRatedFilmsListContainer, createFilmCard(it)); // Рендер карточек фильмов
});
const mostCommentedFilmsListContainer = filmsSection.querySelectorAll(`.films-list--extra .films-list__container`)[1];
films.slice(0).sort((a, b) => b.comments.length - a.comments.length).slice(0, MOST_COMMENTED_COUNT).forEach((it) => {
  renderElement(mostCommentedFilmsListContainer, createFilmCard(it)); // Рендер карточек фильмов
});

const siteFooterStat = document.querySelector(`.footer__statistics`);
renderElement(siteFooterStat, createFooterStatistics()); // Рендер статистики

// renderElement(document.querySelector(`body`), createFilmDetails(films[0]));
