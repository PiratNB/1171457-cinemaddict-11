import Movie from "../models/movie";
import Comment from "../models/comment";

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, filmStore, commentsStore) {
    this._api = api;
    this._filmStore = filmStore;
    this._commentsStore = commentsStore;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((filmModels) => {
          this._filmStore.setItems(filmModels.reduce((acc, it) => {
            return Object.assign({}, acc, {
              [it.id]: Movie.toRaw(it)
            });
          }, {}));
          this._commentsStore.setItems(filmModels.reduce((acc, it) => {
            return Object.assign({}, acc, {
              [it.id]: it.comments.map((comment) => Comment.toRaw(comment))
            });
          }, {}));

          return filmModels;
        });
    }

    const storeFilms = Object.values(this._filmStore.getItems());
    const storeComments = Object.values(this._commentsStore.getItems());

    return Promise.resolve(Movie.parseFilms(storeFilms, storeComments));
  }

  updateFilm(data) {
    if (isOnline()) {
      return this._api.updateFilm(data)
        .then((filmModel) => {
          this._filmStore.setItem(filmModel.id, Movie.toRaw(filmModel));

          return filmModel;
        });
    }

    const localFilm = Object.assign({}, data);

    this._filmStore.setItem(data.id, Movie.toRaw(localFilm));

    return Promise.resolve(localFilm);
  }

  postComment(filmId, newCommentData, filmData) {
    if (isOnline()) {
      return this._api.postComment(filmId, newCommentData)
        .then((filmModel) => {
          this._filmStore.setItem(filmModel.id, Movie.toRaw(filmModel));
          this._commentsStore.setItem(filmModel.id, filmModel.comments.map((it) => Comment.toRaw(it)));

          return filmModel;
        });
    }

    const localFilm = Object.assign({}, filmData);

    this._filmStore.setItem(filmId, Movie.toRaw(localFilm));
    this._commentsStore.setItem(filmId, localFilm.comments.map((it) => Comment.toRaw(it)));

    return Promise.resolve(localFilm);
  }

  deleteComment(commentId, filmData) {
    if (isOnline()) {
      return this._api.deleteComment(commentId)
        .then(() => {
          this._commentsStore.removeItem(commentId);
          this._filmStore.setItem(filmData.id, Movie.toRaw(filmData));
        });
    }

    this._commentsStore.removeItem(commentId);
    this._filmStore.setItem(filmData.id, Movie.toRaw(filmData));

    return Promise.resolve();
  }
}
