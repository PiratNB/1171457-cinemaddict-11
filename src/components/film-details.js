import {COMMENT_EMOTIONS} from "../utils/consts";
import AbstractSmartComponent from "./abstract-smart-component";
import moment from "moment";
import {encode} from "he";
import {nanoid} from "nanoid";

const SHAKE_ANIMATION_TIMEOUT = 600;


export default class FilmDetails extends AbstractSmartComponent {
  constructor(film, onDataChange) {
    super();

    this._film = film;
    this._onDataChange = onDataChange;

    this._closeClickHandler = null;
    this._choosenEmoji = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    const releaseDate = moment(this._film.releaseDate).format(`D MMMM YYYY`);
    const filmDuration = `${moment.duration(this._film.runtime, `minutes`).hours()}h ${moment.duration(this._film.runtime, `minutes`).minutes()}m`;
    const filmGenres = this._film.genres.map((it) => `<span class="film-details__genre">${it}</span>`).join(` `);
    const commentsList = this._film.comments.map((it) => `
                <li class="film-details__comment">
                  <span class="film-details__comment-emoji">
                    <img src="./images/emoji/${it.emotion}.png" width="55" height="55" alt="emoji-${it.emotion}">
                  </span>
                  <div>
                    <p class="film-details__comment-text">${it.message}</p>
                    <p class="film-details__comment-info">
                      <span class="film-details__comment-author">${it.author}</span>
                      <span class="film-details__comment-day">${moment(it.postDate).fromNow()}</span>
                      <button class="film-details__comment-delete">Delete</button>
                    </p>
                  </div>
                </li>
              `).join(``);
    const emotionsList = COMMENT_EMOTIONS.map((it) => `
                  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${it}" value="${it}">
                  <label class="film-details__emoji-label" for="emoji-${it}">
                    <img src="./images/emoji/${it}.png" width="30" height="30" alt="emoji">
                  </label>
                `).join(``);

    return `
    <section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${this._film.posterImage}" alt="${this._film.name}">
              <p class="film-details__age">${this._film.ageRating}+</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${this._film.name}</h3>
                  <p class="film-details__title-original">Original: ${this._film.originalName}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${this._film.rating}</p>
                </div>
              </div>
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${this._film.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${this._film.writers.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${this._film.actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${filmDuration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${this._film.country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${this._film.genres.length > 1 ? `s` : ``}</td>
                  <td class="film-details__cell">
                    ${filmGenres}
                   </td>
                </tr>
              </table>
              <p class="film-details__film-description">
                ${this._film.description}
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._film.isAtWatchlist ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._film.watchingDate ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._film.isFavorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._film.comments.length}</span></h3>
            <ul class="film-details__comments-list">
              ${commentsList}
            </ul>
            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
              </div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
              <div class="film-details__emoji-list">
                ${emotionsList}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>
    `;
  }

  setCloseClickHandler(handler) {
    if (!this._closeClickHandler) {
      this._closeClickHandler = handler;
    }
    this._element.querySelector(`button.film-details__close-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  _subscribeOnEvents() {

    const updateFilmModel = (id, field) => {
      this.getElement().querySelector(`input#${id}`).addEventListener(`change`, (evt) => {
        this._onDataChange(Object.assign({}, this._film, {[field]: evt.target.checked}))
          .then((newFilmModel) => {
            this._film = newFilmModel;
          });
      });
    };

    updateFilmModel(`watchlist`, `isAtWatchlist`);
    updateFilmModel(`favorite`, `isFavorite`);

    this.getElement().querySelector(`input#watched`).addEventListener(`change`, (evt) => {
      const watchingDate = evt.target.checked ? moment() : null;
      this._onDataChange(Object.assign({}, this._film, {watchingDate}))
        .then((newFilmModel) => {
          this._film = newFilmModel;
        });
    });

    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `INPUT`) {
        this._choosenEmoji = evt.target.value;
        this._renderCommentEmoji();
      }
    });

    const keysPressed = new Set();
    const onInputKeydown = (evt) => {
      if (evt.code === `Enter`) {
        evt.preventDefault();
      }
      keysPressed.add(evt.code);
      for (const code of [`ControlLeft`, `Enter`]) {
        if (!keysPressed.has(code)) {
          return;
        }
      }
      keysPressed.clear();
      this._onCommentSubmit();
    };
    const onInputKeyup = (evt) => {
      keysPressed.delete(evt.code);
    };
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`focus`, () => {
      document.addEventListener(`keydown`, onInputKeydown);
      document.addEventListener(`keyup`, onInputKeyup);
    });
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`blur`, () => {
      document.removeEventListener(`keydown`, onInputKeydown);
      document.removeEventListener(`keyup`, onInputKeyup);
    });
    this.getElement().querySelectorAll(`li.film-details__comment`).forEach((it, i) => {
      it.addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `BUTTON`) {
          evt.preventDefault();
          evt.target.disabled = true;
          evt.target.textContent = `Deleting...`;
          const oldComment = this._film.comments[i];
          const newCommentList = [...this._film.comments.slice(0, i), ...this._film.comments.slice(i + 1)];
          this._film = Object.assign({}, this._film, {comments: newCommentList});
          this._onDataChange(Object.assign({}, this._film), oldComment)
            .then((newFilmModel) => {
              this._film = newFilmModel;
              this.rerender();
            })
            .catch(() => {
              evt.target.disabled = false;
              this._shake(evt.target.parentElement.parentElement.parentElement);
              evt.target.textContent = `Delete`;
            });
        }
      });
    });
  }

  _onCommentSubmit() {
    if (this._choosenEmoji && this.getElement().querySelector(`.film-details__comment-input`).value) {
      this.getElement().querySelector(`.film-details__comment-input`).setAttribute(`disabled`, true);
      const newComment = {
        message: encode(this.getElement().querySelector(`.film-details__comment-input`).value),
        emotion: this._choosenEmoji,
        postDate: moment().toISOString(),
        id: nanoid()
      };
      const newCommentList = [...this._film.comments, newComment];
      const updatedFilm = Object.assign({}, this._film, {comments: newCommentList});
      this._choosenEmoji = null;
      this._onDataChange(updatedFilm, newComment)
        .then((newFilmModel) => {
          this._film = newFilmModel;
          this.rerender();
        })
        .catch(() => {
          this.getElement().querySelector(`.film-details__comment-input`).removeAttribute(`disabled`);
          this._addRedBorder(this.getElement().querySelector(`.film-details__comment-input`));
          this._shake(this.getElement().querySelector(`.film-details__new-comment`));
        });
    }
  }

  _renderCommentEmoji() {
    this.getElement().querySelector(`.film-details__new-comment .film-details__add-emoji-label`).innerHTML = `
      <img src="images/emoji/${this._choosenEmoji}.png" width="55" height="55" alt="emoji-${this._choosenEmoji}">
    `;
  }

  recoveryListeners() {
    this.setCloseClickHandler();
    this._subscribeOnEvents();
  }

  _shake(element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _addRedBorder(element) {
    element.style.border = `2px red solid`;
    setTimeout(() => {
      element.style.border = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

}
