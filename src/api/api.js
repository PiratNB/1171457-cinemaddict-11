import Movie from "../models/movie";
import Comment from "../models/comment";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};


const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then((films) => {
        const promises = films.map((it) => this.getComments(it.id));
        return Promise.all(promises)
          .then((comments) => {
            return Movie.parseFilms(films, comments);
          });
      });
  }

  updateFilm(filmCard) {
    return this._load({
      url: `movies/${filmCard.id}`,
      method: Method.PUT,
      body: JSON.stringify(Movie.toRaw(filmCard)),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((film) => {
        return this.getComments(film.id)
          .then((comments) => Movie.parseFilm(film, comments));
      });
  }

  postComment(filmId, newCommentData) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(Comment.toRaw(newCommentData)),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(({movie, comments}) => Movie.parseFilm(movie, comments));
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then((response) => response.json());
  }

  sync(movies) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(movies),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
