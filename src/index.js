import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createPostCard from './templates/post-card.hbs';
import { startFetchPosts } from './js/fetchPosts';
import { continueFetchPosts } from './js/fetchPosts';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
let page = 1;
let searchValue = '';
const perPage = 40;

const onBtnSubmit = async e => {
  e.preventDefault();
  searchValue = e.target.elements.searchQuery.value.trim().toLowerCase();
  try {
    clearFields();
    const { data } = await startFetchPosts(searchValue, page, perPage);
    if (searchValue === '') {
      alertNoEmptySearch();
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    } else if (data.totalHits === 0) {
      alertNoImagesFound();
      loadMoreBtnEl.classList.add('is-hidden');
      return;
    } else {
      galleryContainer.innerHTML = createPostCard(data.hits);
      makeSlider();
      alertAmountImagesFound(data);
      loadMoreBtnEl.classList.remove('is-hidden');
    }
    console.log(data);
  } catch (error) {
    clearFields();
    console.log(error);
  }
};

const onLoadMoreBtnElClick = async () => {
  try {
    page += 1;
    const { data } = await startFetchPosts(searchValue, page, perPage);
    const totalPages = Math.ceil(data.totalHits / perPage);
    if (page > totalPages) {
      alertEndOfSearch();
      return;
    }
    galleryContainer.insertAdjacentHTML('beforeend', createPostCard(data.hits));
    loadMoreBtnEl.classList.remove('is-hidden');
    makeSlider();
  } catch (error) {
    console.log(error);
  }
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
