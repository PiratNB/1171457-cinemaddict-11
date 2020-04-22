const FILMS_TO_RENDER = 5;
const FILMS_EXTRA_TO_RENDER = 2;

import Navigation from "../components/navigation";
import Sort, {SORT_TYPE} from "../components/sort";
import FilmList from "../components/film-list";
import RateCommented from "../components/rate-commented";
import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import BtnShowMore from "../components/btn-show-more";
import {removeElement, renderElement} from "../utils/render";

export default class PageController {
  constructor(container, films) {
    this._container = container;
    this._films = films;
    this._sortedFilms = this._films;
    this._mainControl = new Navigation(this._films);
    this._sortingControl = new Sort();
    this._filmsSection = new FilmList();
    this._allFilmsList = null;
    this._topRatedFilmsList = null;
    this._mostCommentedFilmsList = null;
    this._loadmoreButton = new BtnShowMore();

    this._filmCardsRendered = null;
  }

  _renderFilm(container, film) {
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
  }

  _renderFilmsPack(container, filmsPack) {
    filmsPack.forEach((film) => {
      this._renderFilm(container, film);
    });
  }

  _renderEmptyBoard() {
    this._allFilmsList = new RateCommented(`There are no movies in our database`);
    renderElement(this._filmsSection.getElement(), this._allFilmsList);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SORT_TYPE.DEFAULT:
        this._sortedFilms = this._films;
        break;
      case SORT_TYPE.DATE:
        this._sortedFilms = this._films.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case SORT_TYPE.RATING:
        this._sortedFilms = this._films.slice().sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  _renderFullBoard() {
    this._allFilmsList = new RateCommented();
    renderElement(this._filmsSection.getElement(), this._allFilmsList);
    const allFilmsListContainer = this._allFilmsList.getElement().lastElementChild;
    this._renderFilmsPack(allFilmsListContainer, this._films.slice(0, FILMS_TO_RENDER));

    if (this._films.length > this._filmCardsRendered) {
      renderElement(this._allFilmsList.getElement(), this._loadmoreButton);
      this._loadmoreButton.setClickHandler(() => {
        this._renderFilmsPack(allFilmsListContainer, this._sortedFilms.slice(this._filmCardsRendered, this._filmCardsRendered + FILMS_TO_RENDER));
        this._filmCardsRendered = (this._filmCardsRendered + FILMS_TO_RENDER) > this._sortedFilms.length ? this._sortedFilms.length : (this._filmCardsRendered + FILMS_TO_RENDER);
        if (this._filmCardsRendered === this._sortedFilms.length) {
          this._loadmoreButton.hide();
        }
      });
    }

    this._sortingControl.setSortTypeChooseHandler((sortTypeChosen) => {
      allFilmsListContainer.innerHTML = ``;
      this._sortFilms(sortTypeChosen);
      this._renderFilmsPack(allFilmsListContainer, this._sortedFilms.slice(0, this._filmCardsRendered));
    });

    this._topRatedFilmsList = new RateCommented(`Top rated`);
    renderElement(this._filmsSection.getElement(), this._topRatedFilmsList);
    const filmsSortedByRating = this._films.slice().sort((a, b) => b.rating - a.rating);
    const topRatedFilmsListContainer = this._topRatedFilmsList.getElement().lastElementChild;
    this._renderFilmsPack(topRatedFilmsListContainer, filmsSortedByRating.slice(0, FILMS_EXTRA_TO_RENDER));

    this._mostCommentedFilmsList = new RateCommented(`Most commented`);
    renderElement(this._filmsSection.getElement(), this._mostCommentedFilmsList);
    const filmsSortedByCommentsCount = this._films.slice().sort((a, b) => b.comments.length - a.comments.length);
    const mostCommentedFilmsListContainer = this._mostCommentedFilmsList.getElement().lastElementChild;
    this._renderFilmsPack(mostCommentedFilmsListContainer, filmsSortedByCommentsCount.slice(0, FILMS_EXTRA_TO_RENDER));
  }

  renderMain() {
    renderElement(this._container, this._mainControl);
    renderElement(this._container, this._sortingControl);
    renderElement(this._container, this._filmsSection);

    this._filmCardsRendered = Math.min(this._films.length, FILMS_TO_RENDER);

    if (this._filmCardsRendered === 0) {
      this._renderEmptyBoard();
    } else {
      this._renderFullBoard();
    }
  }
}
