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
    this._syncNeeded = false;
    this._commentsToPost = [];
    this._commentsToDelete = [];
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

    this._syncNeeded = true;

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

    this._syncNeeded = true;

    const localFilm = Object.assign({}, filmData);

    this._filmStore.setItem(filmId, Movie.toRaw(localFilm));
    this._commentsStore.setItem(filmId, localFilm.comments.map((it) => Comment.toRaw(it)));
    this._commentsToPost.push({filmId, comment: newCommentData});
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

    this._syncNeeded = true;

    this._commentsStore.removeItem(commentId);
    this._filmStore.setItem(filmData.id, Movie.toRaw(filmData));

    const commentToPostIndex = this._commentsToPost.findIndex((it) => it.comment.id === commentId);
    if (commentToPostIndex < 0) {
      this._commentsToDelete.push(commentId);
    } else {
      this._commentsToDelete = [...this._commentsToDelete.slice(0, commentToPostIndex), ...this._commentsToDelete.slice(commentToPostIndex + 1)];
    }

    return Promise.resolve();
  }

  sync() {
    if (!this._syncNeeded) {
      return Promise.resolve();
    }
    if (isOnline()) {
      const storeFilms = Object.values(this._filmStore.getItems());

      return this._api.sync(storeFilms, this._commentsToPost, this._commentsToDelete)
        .then((films) => {
          this.getFilms();
          this._commentsToPost = [];

          this._commentsToDelete = [];
          this._syncNeeded = false;
          return films;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
