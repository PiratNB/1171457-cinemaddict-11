import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import {removeElement, renderElement} from "../utils/render";
import moment from "moment";

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class MovieController {
  constructor(container, film, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._filmData = film;
    this._filmCard = null;
    this._filmPopup = null;

    this._closePopup = this._closePopup.bind(this);
    this._handleEscKeydown = this._handleEscKeydown.bind(this);
  }

  _handleEscKeydown(keydownEvt) {
    if (keydownEvt.code === `Escape`) {
      this._closePopup();
    }
  }

  _closePopup() {
    removeElement(this._filmPopup);
    this._filmPopup = null;
    document.removeEventListener(`keydown`, this._handleEscKeydown);
  }

  _createCard() {
    this._filmCard = new FilmCard(this._filmData);

    this._filmCard.setClickHandler(() => {
      this._onViewChange();
      this._filmPopup = new FilmDetails(this._filmData, this._onDataChange);

      renderElement(document.querySelector(`body`), this._filmPopup);
      this._filmPopup.setCloseClickHandler(this._closePopup);
      document.addEventListener(`keydown`, this._handleEscKeydown);
    });

    this._filmCard.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(Object.assign({}, this._filmData, {isAtWatchlist: !this._filmData.isAtWatchlist}))
        .catch(() => {
          this.shake();
        });
    });

    this._filmCard.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(Object.assign({}, this._filmData, {watchingDate: this._filmData.watchingDate ? null : moment()}))
        .catch(() => {
          this.shake();
        });
    });

    this._filmCard.setFavoriteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(Object.assign({}, this._filmData, {isFavorite: !this._filmData.isFavorite}))
      .catch(() => {
        this.shake();
      });
    });
  }

  render() {
    this._createCard();

    renderElement(this._container, this._filmCard); // Рендер карточек фильмов
  }

  setDefaultView() {
    if (this._filmPopup) {
      this._closePopup();
    }
  }

  removeCard() {
    removeElement(this._filmCard);
  }

  shake() {
    this._filmCard.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._filmCard.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
