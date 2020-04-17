const FILMS_COUNT = Math.round(Math.random() * 500);
const FILMS_TO_RENDER = 5;
const FILMS_EXTRA_TO_RENDER = 2;

import ProfileUser from "./components/profile-user";
import Navigation from "./components/navigation";
import Sort from "./components/sort";
import FilmList from "./components/film-list";
import RateCommented from "./components/rate-commented";
import FilmCard from "./components/film-card";
import FilmDetails from "./components/film-details";
import BtnShowMore from "./components/btn-show-more";
import FilmStat from "./components/film-stat";
import {renderElement} from "./utils";
import {generateFilmBase} from "./mocks/film-cards";

const renderFilm = (container, film) => {
  const filmCard = new FilmCard(film);
  const onFilmPosterClick = (evt) => {
    if (!(evt.target.className === `film-card__title`) &&
      !(evt.target.className === `film-card__poster`) &&
      !(evt.target.className === `film-card__comments`)) {
      return;
    }
    const filmPopup = new FilmDetails(film);
    const onPopupCloseClick = () => {
      filmPopup.getElement().remove();
      filmPopup.removeElement();
    };

    filmPopup.getElement().querySelector(`button.film-details__close-btn`).addEventListener(`click`, onPopupCloseClick);

    renderElement(document.querySelector(`body`), filmPopup.getElement());
  };

  filmCard.getElement().addEventListener(`click`, onFilmPosterClick);

  renderElement(container, filmCard.getElement()); // Рендер карточек фильмов
};

const renderFilmsPack = (container, filmsPack) => {
  filmsPack.forEach((film) => {
    renderFilm(container, film);
  });
};

const films = generateFilmBase(FILMS_COUNT);
let filmCardsRendered = Math.min(films.length, FILMS_TO_RENDER);

renderElement(document.querySelector(`header.header`), new ProfileUser(films.filter((it) => it.isWatched).length).getElement()); // Рендер статуса пользователя
renderElement(document.querySelector(`.footer__statistics`), new FilmStat(films).getElement()); // Рендер общего кол-ва фильмов
const mainContainer = document.querySelector(`main.main`);
renderElement(mainContainer, new Navigation(films).getElement());
renderElement(mainContainer, new Sort().getElement());
const filmsSection = new FilmList().getElement();
renderElement(mainContainer, filmsSection);

// Рендер всех фильмов
const allFilmsList = new RateCommented().getElement();
renderElement(filmsSection, allFilmsList);
const allFilmsListContainer = allFilmsList.lastElementChild;
renderFilmsPack(allFilmsListContainer, films.slice(0, FILMS_TO_RENDER));

const loadmoreButton = new BtnShowMore().getElement();
if (films.length > filmCardsRendered) {
  renderElement(allFilmsList, loadmoreButton); // Рендер кнопки Loadmore
  loadmoreButton.addEventListener(`click`, () => {
    renderFilmsPack(allFilmsListContainer, films.slice(filmCardsRendered, filmCardsRendered + FILMS_TO_RENDER));
    filmCardsRendered = (filmCardsRendered + FILMS_TO_RENDER) > films.length ? films.length : (filmCardsRendered + FILMS_TO_RENDER);
    if (filmCardsRendered === films.length) {
      loadmoreButton.classList.add(`visually-hidden`);
    }
  });
}

// Рендер Extra фильмов
const topRatedFilmsList = new RateCommented(`Top rated`).getElement();
renderElement(filmsSection, topRatedFilmsList);
const filmsSortedByRating = films.slice().sort((a, b) => b.rating - a.rating);
const topRatedFilmsListContainer = topRatedFilmsList.lastElementChild;
renderFilmsPack(topRatedFilmsListContainer, filmsSortedByRating.slice(0, FILMS_EXTRA_TO_RENDER));

const mostCommentedFilmsList = new RateCommented(`Most commented`).getElement();
renderElement(filmsSection, mostCommentedFilmsList);
const filmsSortedByCommentsCount = films.slice().sort((a, b) => b.comments.length - a.comments.length);
const mostCommentedFilmsListContainer = mostCommentedFilmsList.lastElementChild;
renderFilmsPack(mostCommentedFilmsListContainer, filmsSortedByCommentsCount.slice(0, FILMS_EXTRA_TO_RENDER));
