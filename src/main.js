const FILMS_COUNT = Math.round(Math.random() * 500);
const FILMS_TO_RENDER = 5;
const TOP_RATED_COUNT = 2;
const MOST_COMMENTED_COUNT = 2;

import ProfileUser from "./components/profile-user";
import Navigation from "./components/navigation";
import Sort from "./components/sort";
import FilmList from "./components/film-list";
import FilmCard from "./components/film-card";
import BtnShowMore from "./components/btn-show-more";
import RateCommented from "./components/rate-commented";
import FilmStat from "./components/film-stat";
// import FilmDetails from "./components/film-details";
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

const FilmsListContainer = filmsSection.querySelectorAll(`.films-list--extra .films-list__container`);

const filmsSortedByRating = films.slice().sort((a, b) => b.rating - a.rating);
const filmsSortedByCommentsCount = films.slice().sort((a, b) => b.comments.length - a.comments.length);

const topRatedFilmsListContainer = FilmsListContainer[0];
renderFilmsPack(topRatedFilmsListContainer, filmsSortedByRating.slice(0, TOP_RATED_COUNT));

const mostCommentedFilmsListContainer = FilmsListContainer[1];
renderFilmsPack(mostCommentedFilmsListContainer, filmsSortedByCommentsCount.slice(0, MOST_COMMENTED_COUNT));

const siteFooterStat = document.querySelector(`.footer__statistics`);
renderElement(siteFooterStat, createStat(films)); // Рендер статистики

// renderElement(document.querySelector(`body`), createFilmDetails(films[0]));
