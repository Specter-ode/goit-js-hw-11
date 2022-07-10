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

const onBtnSubmit = async e => {
  e.preventDefault();
  const searchValue = e.target.elements.searchQuery.value.trim().toLowerCase();
  try {
    clearFields();
    const { data } = await startFetchPosts(searchValue, page);
    if (searchValue === '') {
      loadMoreBtnEl.classList.add('is-hidden');
    return;
    } else if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtnEl.classList.add('is-hidden');
    } else {
      galleryContainer.innerHTML = createPostCard(data.hits);
      loadMoreBtnEl.classList.remove('is-hidden');
    }
    console.log(data);
  } catch (error) {
    clearFields();
    console.log(error);
  }
};

function clearFields() {
  galleryContainer.innerHTML = '';
}

const onLoadMoreBtnElClick = async e => {
try {
  page += 1;
  const { data } = await continueFetchPosts(page);
  galleryContainer.insertAdjacentHTML('beforeend', createPostCard(data.hits));
  loadMoreBtnEl.classList.remove('is-hidden');
} catch (error) {
    console.log(error);
}
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

formEl.addEventListener('submit', onBtnSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnElClick);
