import {FILTER_TYPE} from "../mocks/consts";
import {getFilmsByFilter} from "../utils/utils";

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilterType = FILTER_TYPE.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getAllMovies() {
    return this._movies;
  }

  getMovies() {
    return getFilmsByFilter(this._movies, this._activeFilterType);
  }

  setMovies(movies) {
    this._movies = [...movies];
  }

  updateMovie(id, movieData) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), movieData, this._movies.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }
}
