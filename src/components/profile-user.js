const getUserLevel = (filmsCount) => {
  if (filmsCount > 0 && filmsCount <= 10) {
    return `Novice`;
  } else if (filmsCount > 10 && filmsCount <= 20) {
    return `Fan`;
  } else if (filmsCount > 20) {
    return `Movie Buff`;
  }
  return ``;
};

export const createProfileUser = (filmsCount) => {
  return `
    <section class="header__profile profile">
      <p class="profile__rating">${getUserLevel(filmsCount)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
    `;
};
