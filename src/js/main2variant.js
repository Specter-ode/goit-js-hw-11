import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import createPostCard from './templates/post-card.hbs';
import { fetchPost } from './js/fetchPosts2variant';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.load-more');

const onBtnSubmit = e => {
  e.preventDefault();
  const searchValue = e.target.elements.searchQuery.value.trim().toLowerCase();
  startFetchPosts(searchValue, page)
    .then(({ data } = {}) => {
      clearFields();
      console.log(data);
      console.log(data.totalHits);
      clearFields();
      if (searchValue === '') {
        loadMoreBtnEl.classList.add('is-hidden');
        return;
      } else if (data.totalHits === 0) {
        console.log(loadMoreBtnEl);
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMoreBtnEl.classList.add('is-hidden');
      } else {
        galleryContainer.innerHTML = createPostCard(data.hits);
        loadMoreBtnEl.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      clearFields();
      console.log(error);
    });
};

const onLoadMoreBtnElClick = e => {
  page += 1;
  continueFetchPosts(page).then(({ data } = {}) => {
    galleryContainer.insertAdjacentHTML('beforeend', createPostCard(data.hits));
    loadMoreBtnEl.classList.remove('is-hidden');
  });
};

function clearFields() {
  galleryContainer.innerHTML = '';
}
formEl.addEventListener('submit', onBtnSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnElClick);