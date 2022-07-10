import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { renderCards } from './renderCards';
import { PixabayApi } from './fetchPostsSecond';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
const pixabay = new PixabayApi();

const onBtnSubmit = e => {
  e.preventDefault();
  pixabay.query = e.currentTarget.elements['searchQuery'].value.trim().toLowerCase();
  pixabay.page = 1;
  pixabay.fetchPosts()
  .then(data => {
    clearFields();
    console.log(data.hits.length)
    if (pixabay.query === '') {
      alertNoEmptySearch();
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    } else if (!data.hits.length) {
      alertNoImagesFound();
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    } else {
      galleryContainer.innerHTML = renderCards(data.hits);
      makeSlider();
      alertAmountImagesFound(data);
      loadMoreBtnEl.classList.remove('is-hidden');
    }
  })
  .catch(error => {
    console.log(error);
  });
};

const onLoadMoreBtnElClick = () => {
    pixabay.page += 1;
    pixabay.fetchPosts()
    .then( data => {
      const totalPages = Math.ceil(data.totalHits / pixabay.limitPerPage);
      if (pixabay.page > totalPages) {
        alertEndOfSearch();
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      }
      galleryContainer.insertAdjacentHTML('beforeend', renderCards(data.hits));
      loadMoreBtnEl.classList.remove('is-hidden');
      makeSlider();Cards
    })
    .catch(error => {
      console.log(error);
    });
};

formEl.addEventListener('submit', onBtnSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnElClick);

function clearFields() {
  galleryContainer.innerHTML = '';
}

function makeSlider() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    captionPosition: 'bottom',
  }).refresh();
}
function alertAmountImagesFound(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function alertNoEmptySearch() {
  Notify.failure('The search cannot be empty. Please make correct query.');
}

function alertNoImagesFound() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}
