import { renderCards } from './renderCards';
import { PixabayApi } from './fetchPostsSecond';
import { makeSlider } from '../simpleSlider';
import {
  alertAmountImagesFound,
  alertNoEmptySearch,
  alertNoImagesFound,
  alertEndOfSearch,
} from '../alerts';
import { scrollDownOnTwoRows, btnGoTopStatus, goTop } from '../scroll';

const galleryContainer = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
const btnMoveDownOnTwoRows = document.querySelector('.btn-move-down');
const btnGoTop = document.querySelector('.btn-move-up');
const pixabay = new PixabayApi();

const mutationObs = new MutationObserver(mutationRecord => {
  mutationRecord.forEach(mutation => {
    const galleryCards = [...mutation.addedNodes].filter(
      nodeItem => nodeItem.nodeName !== '#text'
    );
    setTimeout(() => {
      galleryCards.forEach(card => {
        card.classList.add('animate');
      });
    }, 0);
  });
});

mutationObs.observe(galleryContainer, {
  childList: true,
});

const onBtnSubmit = e => {
  e.preventDefault();
  pixabay.query = e.currentTarget.elements['searchQuery'].value
    .trim()
    .toLowerCase();
  pixabay.page = 1;
  pixabay
    .fetchPosts()
    .then(data => {
      clearFields();
      if (pixabay.query === '') {
        alertNoEmptySearch();
        loadMoreBtnEl.classList.add('is-hidden');
        btnMoveDownOnTwoRows.classList.add('is-hidden');
        return;
      } else if (!data.hits.length) {
        alertNoImagesFound();
        loadMoreBtnEl.classList.add('is-hidden');
        btnMoveDownOnTwoRows.classList.add('is-hidden');
        return;
      } else {
        galleryContainer.innerHTML = renderCards(data.hits);
        makeSlider();
        alertAmountImagesFound(data);
        loadMoreBtnEl.classList.remove('is-hidden');
        btnMoveDownOnTwoRows.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      console.log(error);
    });
};

const onLoadMoreBtnElClick = () => {
  pixabay.page += 1;
  pixabay
    .fetchPosts()
    .then(data => {
      const totalPages = Math.ceil(data.totalHits / pixabay.limitPerPage);
      if (pixabay.page > totalPages) {
        alertEndOfSearch();
        loadMoreBtnEl.classList.add('is-hidden');
        btnMoveDownOnTwoRows.classList.add('is-hidden');
        return;
      }
      galleryContainer.insertAdjacentHTML('beforeend', renderCards(data.hits));
      loadMoreBtnEl.classList.remove('is-hidden');
      makeSlider();
    })
    .catch(error => {
      console.log(error);
    });
};

formEl.addEventListener('submit', onBtnSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnElClick);
window.addEventListener('scroll', btnGoTopStatus);
btnGoTop.addEventListener('click', goTop);
btnMoveDownOnTwoRows.addEventListener('click', scrollDownOnTwoRows);

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
