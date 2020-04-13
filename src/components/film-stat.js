export const createStat = (films) => {
  return (
    `<p>${films.length} movie${films.length > 1 ? `s` : ``} inside</p>`
  );
};
