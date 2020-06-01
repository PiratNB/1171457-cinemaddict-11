import AbstractComponent from "./abstract-component";
import moment from "moment";

const createFilmCard = ({name, posterImage, rating, releaseDate, runtime, genres, description, comments, isFavorite, isAtWatchlist, isWatched}) => {
  const releaseYear = moment(releaseDate).year();
  const filmDuration = `${moment.duration(runtime, `minutes`).hours()}h ${moment.duration(runtime, `minutes`).minutes()}m`;
  const shortDescription = description.length > 140 ? `${description.slice(0, 139)}&#8230` : description;

  return (
    `<article class="film-card">
    <h3 class="film-card__title">${name}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${filmDuration}</span>
      <span class="film-card__genre">${genres.length ? genres[0] : ``}</span>
    </p>
    <img src="${posterImage}" alt="${name}" class="film-card__poster">
    <p class="film-card__description">${shortDescription}</p>
    <a class="film-card__comments">${comments.length} comment${comments.length > 1 ? `s` : ``}</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isAtWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatched ? `film-card__controls-item--active` : ``}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
    </form>
  </article>`
  );
};

export default class FilmCard extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (!(evt.target.className === `film-card__title`) &&
        !(evt.target.className === `film-card__poster`) &&
        !(evt.target.className === `film-card__comments`)) {
        return;
      }
      handler();
    });
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`button.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`button.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`button.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }

}

