const FILMS_COUNT = Math.round(Math.random() * 5) + 20;
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
// import {createFilmDetails} from "./components/film-details";
import {renderElement} from "./utils";
import {generateFilmBase} from "./mocks/film-cards";

const renderFilmsPack = (container, filmsPack) => {
  filmsPack.forEach((it) => {
    renderElement(container, createFilmCard(it)); // Рендер карточек фильмов
  });
};

const films = generateFilmBase(FILMS_COUNT);
let filmCardsRendered = Math.min(films.length, FILMS_TO_RENDER);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

renderElement(siteHeaderElement, createProfileUser(films.filter((it) => it.isWatched).length)); // Рендер аватарки и статуса пользователя
renderElement(siteMainElement, createNavigation(films)); // Рендер главного меню
renderElement(siteMainElement, createSort()); // Рендер панели сортировки
renderElement(siteMainElement, createFilmsList()); // Рендер секции с фильмами
const filmsSection = siteMainElement.querySelector(`.films`);

const filmListContainerElement = siteMainElement.querySelector(`.films-list__container`);

renderFilmsPack(filmListContainerElement, films.slice(0, FILMS_TO_RENDER));
if (films.length > filmCardsRendered) {
  renderElement(filmsSection.querySelector(`.films-list`), createBtnShowMore()); // Рендер кнопки Loadmore
  const loadMoreButton = filmsSection.querySelector(`.films-list__show-more`);
  loadMoreButton.addEventListener(`click`, () => {
    renderFilmsPack(filmListContainerElement, films.slice(filmCardsRendered, filmCardsRendered + FILMS_TO_RENDER));
    filmCardsRendered = (filmCardsRendered + FILMS_TO_RENDER) > films.length ? films.length : (filmCardsRendered + FILMS_TO_RENDER);
    if (filmCardsRendered === films.length) {
      loadMoreButton.classList.add(`visually-hidden`);
    }
  });
}

renderElement(filmsSection, createTopRatedMostCommented(), `afterend`); // Рендер секции с самыми популярными и комментируемыми фильмами

// Рендер Top rated и Моst commented фильмов
renderElement(filmsSection, createTopRatedMostCommented(`Top rated`));
renderElement(filmsSection, createTopRatedMostCommented(`Most commented`));

const topRatedFilmsListContainer = filmsSection.querySelectorAll(`.films-list--extra .films-list__container`)[0];
renderFilmsPack(topRatedFilmsListContainer, films.slice(0).sort((a, b) => b.rating - a.rating).slice(0, TOP_RATED_COUNT));

const mostCommentedFilmsListContainer = filmsSection.querySelectorAll(`.films-list--extra .films-list__container`)[1];
renderFilmsPack(mostCommentedFilmsListContainer, films.slice(0).sort((a, b) => b.comments.length - a.comments.length).slice(0, MOST_COMMENTED_COUNT));

const siteFooterStat = document.querySelector(`.footer__statistics`);
renderElement(siteFooterStat, `<p>${films.length} movies inside</p>`); // Рендер статистики

// renderElement(document.querySelector(`body`), createFilmDetails(films[0]));
