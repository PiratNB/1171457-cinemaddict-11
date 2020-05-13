import Movie from "./models/movie";

export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }

  getFilms() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, {headers})
      .then((response) => response.json())
      .then((films) => {
        return Promise.all(films.map((it) => this._getComments(it.id)))
          .then((comments) => {
            return Movie.parseFilms(films, comments);
          });
      });
  }

  _getComments(filmId) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${parseInt(filmId, 10)}`, {headers})
      .then((response) => response.json());
  }
}
