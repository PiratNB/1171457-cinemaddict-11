const FILMS_TO_RENDER = 5;
const FILMS_EXTRA_TO_RENDER = 2;

import Sort, {SortType} from "../components/sort";
import Film from "../components/film-list";
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
    this._filmsSection = new Film();
    this._allFilms = null;
    this._mainFilmsContainer = null;
    this._topRatedFilmsContainer = null;
    this._mostCommentedFilmsContainer = null;
    this._topRatedFilms = null;
    this._mostCommentedFilms = null;
    this._loadmoreButton = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._filmRenderedCount = null;
    this._filmsRendered = [];
    this._currentSortType = SortType.DEFAULT;

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
      this._allFilms = new RateCommented();
      renderElement(this._filmsSection.getElement(), this._allFilms);
      this._mainFilmsContainer = this._allFilms.getElement().lastElementChild;
      this._topRatedFilms = new RateCommented(`Top rated`);
      renderElement(this._filmsSection.getElement(), this._topRatedFilms);
      this._topRatedFilmsContainer = this._topRatedFilms.getElement().lastElementChild;
      this._mostCommentedFilms = new RateCommented(`Most commented`);
      renderElement(this._filmsSection.getElement(), this._mostCommentedFilms);
      this._mostCommentedFilmsContainer = this._mostCommentedFilms.getElement().lastElementChild;

      this._sortingControl.setSortTypeChooseHandler((sortTypeChosen) => {
        this._currentSortType = sortTypeChosen;
        this._updateFilms(FILMS_TO_RENDER);
      });

      this._renderFullBoard(this._filmsModel.getMovies(), FILMS_TO_RENDER);
    }
  }

  _renderFullBoard(films, count) {
    this._renderFilmsPack(this._mainFilmsContainer, films.slice(0, count));
    this._renderFilmsPack(this._topRatedFilmsContainer, this._filmsModel.getAllMovies().slice(0).sort((a, b) => b.rating - a.rating).slice(0, FILMS_EXTRA_TO_RENDER));
    this._renderFilmsPack(this._mostCommentedFilmsContainer, this._filmsModel.getAllMovies().slice(0).sort((a, b) => b.comments.length - a.comments.length).slice(0, FILMS_EXTRA_TO_RENDER));
    this._filmRenderedCount = count;
    this._userLevel.updateUserLevel(this._filmsModel.getAllMovies().filter((it) => it.watchingDate).length);
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
    this._allFilms = new RateCommented(`There are no movies in our database`);
    renderElement(this._filmsSection.getElement(), this._allFilms);
  }

  _removeFilms() {
    this._filmsRendered.forEach((filmController) => filmController.removeCard());
    this._filmsRendered = [];
  }

  _getSortedFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getMovies().slice().sort((a, b) => (b.releaseDate).localeCompare(a.releaseDate));
      case SortType.RATING:
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
      renderElement(this._allFilms.getElement(), this._loadmoreButton);
      this._loadmoreButton.setClickHandler(() => {
        const films = this._getSortedFilms();
        this._renderFilmsPack(this._mainFilmsContainer, films.slice(this._filmRenderedCount, this._filmRenderedCount + FILMS_TO_RENDER));
        this._filmRenderedCount = (this._filmRenderedCount + FILMS_TO_RENDER) > films.length ? films.length : (this._filmRenderedCount + FILMS_TO_RENDER);
        if (this._filmRenderedCount === films.length) {
          removeElement(this._loadmoreButton);
        }
      });
    }
  }

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
    this._currentSortType = SortType.DEFAULT;
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
