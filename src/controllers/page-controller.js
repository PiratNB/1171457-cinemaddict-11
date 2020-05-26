const FILMS_TO_RENDER = 5;
const FILMS_EXTRA_TO_RENDER = 2;

import Sort, {SORT_TYPE} from "../components/sort";
import FilmList from "../components/film-list";
import RateCommented from "../components/rate-commented";
import BtnShowMore from "../components/btn-show-more";
import MovieController from "./movie-controller";
import {removeElement, renderElement} from "../utils/render";
import FilterController from "./filter-controller";
import ProfileUser from "../components/profile-user";

export default class PageController {
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;
    this._userLevel = new ProfileUser();
    this._filterController = new FilterController(this._container, this._filmsModel);
    this._sortingControl = new Sort();
    this._filmsSection = new FilmList();
    this._allFilmsList = null;
    this._mainFilmsListContainer = null;
    this._topRatedFilmsListContainer = null;
    this._mostCommentedFilmsListContainer = null;
    this._topRatedFilmsList = null;
    this._mostCommentedFilmsList = null;
    this._loadmoreButton = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._filmRenderedCount = null;
    this._filmsRendered = [];
    this._currentSortType = SORT_TYPE.DEFAULT;

    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    this._filterController.render();
    renderElement(document.querySelector(`header.header`), this._userLevel);
    renderElement(this._container, this._sortingControl);
    renderElement(this._container, this._filmsSection);

    this._filmRenderedCount = Math.min(this._filmsModel.getMovies().length, FILMS_TO_RENDER);

    if (this._filmRenderedCount === 0) {
      this._renderEmptyBoard();
    } else {
      this._allFilmsList = new RateCommented();
      renderElement(this._filmsSection.getElement(), this._allFilmsList);
      this._mainFilmsListContainer = this._allFilmsList.getElement().lastElementChild;
      this._topRatedFilmsList = new RateCommented(`Top rated`);
      renderElement(this._filmsSection.getElement(), this._topRatedFilmsList);
      this._topRatedFilmsListContainer = this._topRatedFilmsList.getElement().lastElementChild;
      this._mostCommentedFilmsList = new RateCommented(`Most commented`);
      renderElement(this._filmsSection.getElement(), this._mostCommentedFilmsList);
      this._mostCommentedFilmsListContainer = this._mostCommentedFilmsList.getElement().lastElementChild;

      this._sortingControl.setSortTypeChooseHandler((sortTypeChosen) => {
        this._currentSortType = sortTypeChosen;
        this._updateFilms(FILMS_TO_RENDER);
      });

      this._renderFullBoard(this._filmsModel.getMovies(), FILMS_TO_RENDER);
    }
  }

  _renderFullBoard(films, count) {
    this._renderFilmsPack(this._mainFilmsListContainer, films.slice(0, count));
    this._renderFilmsPack(this._topRatedFilmsListContainer, this._filmsModel.getAllMovies().slice(0).sort((a, b) => b.rating - a.rating).slice(0, FILMS_EXTRA_TO_RENDER));
    this._renderFilmsPack(this._mostCommentedFilmsListContainer, this._filmsModel.getAllMovies().slice(0).sort((a, b) => b.comments.length - a.comments.length).slice(0, FILMS_EXTRA_TO_RENDER));
    this._filmRenderedCount = count;
    this._userLevel.updateUserLevel(this._filmsModel.getAllMovies().filter((it) => it.isWatched).length);
    this._renderLoadmoreButton();
  }

  _renderFilmsPack(container, filmsPack) {
    filmsPack.forEach((film) => {
      const filmController = new MovieController(container, film, this._onDataChange, this._onViewChange);
      this._filmsRendered.push(filmController);
      filmController.render();
    });
  }

  _renderEmptyBoard() {
    this._allFilmsList = new RateCommented(`There are no movies in our database`);
    renderElement(this._filmsSection.getElement(), this._allFilmsList);
  }

  _removeFilms() {
    this._filmsRendered.forEach((filmController) => filmController.removeCard());
    this._filmsRendered = [];
  }

  _getSortedFilms() {
    switch (this._currentSortType) {
      case SORT_TYPE.DATE:
        return this._filmsModel.getMovies().slice().sort((a, b) => b.releaseDate - a.releaseDate);
      case SORT_TYPE.RATING:
        return this._filmsModel.getMovies().slice().sort((a, b) => b.rating - a.rating);
      default:
        return this._filmsModel.getMovies();
    }
  }

  _renderLoadmoreButton() {
    if (this._loadmoreButton) {
      removeElement(this._loadmoreButton);
    }
    if (this._filmsModel.getMovies().length > this._filmRenderedCount) {
      this._loadmoreButton = new BtnShowMore();
      renderElement(this._allFilmsList.getElement(), this._loadmoreButton);
      this._loadmoreButton.setClickHandler(() => {
        const films = this._getSortedFilms();
        this._renderFilmsPack(this._mainFilmsListContainer, films.slice(this._filmRenderedCount, this._filmRenderedCount + FILMS_TO_RENDER));
        this._filmRenderedCount = (this._filmRenderedCount + FILMS_TO_RENDER) > films.length ? films.length : (this._filmRenderedCount + FILMS_TO_RENDER);
        if (this._filmRenderedCount === films.length) {
          removeElement(this._loadmoreButton);
        }
      });
    }
  }


  // правки ниже
  _onDataChange(filmData, updateComment) {

    const dataChange = (filmModel) => {
      const film = filmModel || filmData;
      const isUpdateSucceed = this._filmsModel.updateMovie(film);
      if (isUpdateSucceed) {
        this._updateFilms();
      }
      return this._filmsModel.getFilmById(filmData.id);
    };

    if (updateComment) {
      if (updateComment.author) {
        return this._api.deleteComment(updateComment.id, filmData).then(dataChange);
      }
      return this._api.postComment(filmData.id, updateComment, filmData).then(dataChange);
    }

    return this._api.updateFilm(filmData).then(dataChange);
  }

  _onViewChange() {
    this._filmsRendered.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._sortingControl.reset();
    this._currentSortType = SORT_TYPE.DEFAULT;
    this._updateFilms(FILMS_TO_RENDER);
  }

  _updateFilms(count = this._filmRenderedCount) {
    this._removeFilms();
    this._renderFullBoard(this._getSortedFilms(), count);
  }

  show() {
    this._filmsSection.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._filmsSection.getElement().classList.add(`visually-hidden`);
  }
}
