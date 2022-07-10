export function renderCards(cards) {
  const markup = cards
    .map(card => {
      const { id, largeImageURL, webformatURL, tags, likes, views, comments, downloads } = card
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery__card" id="${id}">
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="gallery__info">
              <p class="gallery__info-item"><b>Likes</b>${likes}</p>
              <p class="gallery__info-item"><b>Views</b>${views}</p>
              <p class="gallery__info-item"><b>Comments</b>${comments}</p>
              <p class="gallery__info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `
    })
    .join('');
    return markup;
}