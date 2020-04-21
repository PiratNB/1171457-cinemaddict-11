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
import {renderElement, removeElement} from "./utils/render";
import {generateFilmBase} from "./mocks/film-cards";

const renderFilm = (container, film) => {
  const filmCard = new FilmCard(film);

  filmCard.setClickHandler(() => {
    const filmPopup = new FilmDetails(film);
    const closePopup = () => {
      removeElement(filmPopup);
      document.removeEventListener(`keydown`, onEscKeydown);
    };

    const onEscKeydown = (keydownEvt) => {
      if (keydownEvt.code === `Escape`) {
        closePopup();
      }
    };

    renderElement(document.querySelector(`body`), filmPopup);
    filmPopup.setCloseClickHandler(closePopup);
    document.addEventListener(`keydown`, onEscKeydown);
  });

  renderElement(container, filmCard); // Рендер карточек фильмов
};

const renderFilmsPack = (container, filmsPack) => {
  filmsPack.forEach((film) => {
    renderFilm(container, film);
  });
};

const films = generateFilmBase(FILMS_COUNT);
let filmCardsRendered = Math.min(films.length, FILMS_TO_RENDER);

renderElement(document.querySelector(`header.header`), new ProfileUser(films.filter((it) => it.isWatched).length)); // Рендер статуса пользователя
renderElement(document.querySelector(`.footer__statistics`), new FilmStat(films)); // Рендер общего кол-ва фильмов
const mainContainer = document.querySelector(`main.main`);
renderElement(mainContainer, new Navigation(films));
renderElement(mainContainer, new Sort());
const filmsSection = new FilmList();
renderElement(mainContainer, filmsSection);

if (filmCardsRendered === 0) {
  renderElement(filmsSection.getElement(), new RateCommented(`There are no movies in our database`));
} else {
// Рендер всех фильмов
  const allFilmsList = new RateCommented();
  renderElement(filmsSection.getElement(), allFilmsList);
  const allFilmsListContainer = allFilmsList.getElement().lastElementChild;
  renderFilmsPack(allFilmsListContainer, films.slice(0, FILMS_TO_RENDER));

  const loadmoreButton = new BtnShowMore();
  if (films.length > filmCardsRendered) {
    renderElement(allFilmsList.getElement(), loadmoreButton); // Рендер кнопки Loadmore
    loadmoreButton.setClickHandler(() => {
      renderFilmsPack(allFilmsListContainer, films.slice(filmCardsRendered, filmCardsRendered + FILMS_TO_RENDER));
      filmCardsRendered = (filmCardsRendered + FILMS_TO_RENDER) > films.length ? films.length : (filmCardsRendered + FILMS_TO_RENDER);
      if (filmCardsRendered === films.length) {
        loadmoreButton.classList.hide();
      }
    });
  }

  // Рендер Extra фильмов
  const topRatedFilmsList = new RateCommented(`Top rated`);
  renderElement(filmsSection.getElement(), topRatedFilmsList);
  const filmsSortedByRating = films.slice().sort((a, b) => b.rating - a.rating);
  const topRatedFilmsListContainer = topRatedFilmsList.getElement().lastElementChild;
  renderFilmsPack(topRatedFilmsListContainer, filmsSortedByRating.slice(0, FILMS_EXTRA_TO_RENDER));

  const mostCommentedFilmsList = new RateCommented(`Most commented`);
  renderElement(filmsSection.getElement(), mostCommentedFilmsList);
  const filmsSortedByCommentsCount = films.slice().sort((a, b) => b.comments.length - a.comments.length);
  const mostCommentedFilmsListContainer = mostCommentedFilmsList.getElement().lastElementChild;
  renderFilmsPack(mostCommentedFilmsListContainer, filmsSortedByCommentsCount.slice(0, FILMS_EXTRA_TO_RENDER));
}
