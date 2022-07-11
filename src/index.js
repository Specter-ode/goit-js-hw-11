import createPostCard from './templates/post-card.hbs';
import { fetchPosts } from './js/fetchPosts';
import { makeSlider } from  './js/simpleSlider'
import { alertAmountImagesFound, alertNoEmptySearch, alertNoImagesFound, alertEndOfSearch } from './js/alerts';
import { scrollDownOnTwoRows, btnGoTopStatus, goTop } from './js/scroll';

const galleryContainer = document.querySelector('.gallery');
const formEl = document.querySelector('#search-form');
const btnMoveDownOnTwoRows = document.querySelector('.btn-move-down');
const btnGoTop = document.querySelector('.btn-move-up');
const targetElementForInfiniteScroll = document.querySelector('.target-element');
const intersectionObsOptions = {
  root: null,
  rootMargin: '0px 0px 150px 0px',
  threshold: 1.0,
};
let page = null;
let searchValue = '';
const perPage = 40;

const onBtnSubmit = async e => {
  e.preventDefault();
  page = 1;
  searchValue = e.target.elements.searchQuery.value.trim().toLowerCase();
  try {
    intersectionObs.unobserve(targetElementForInfiniteScroll);
    clearFields();
    const { data } = await fetchPosts(searchValue, page, perPage);
    if (searchValue === '') {
      alertNoEmptySearch();
      btnMoveDownOnTwoRows.classList.add('is-hidden');
      return;
    } else if (data.totalHits === 0) {
      alertNoImagesFound();
      btnMoveDownOnTwoRows.classList.add('is-hidden');
      return;
    } else {
      galleryContainer.innerHTML = createPostCard(data.hits);
      alertAmountImagesFound(data);
      intersectionObs.observe(targetElementForInfiniteScroll);
      btnMoveDownOnTwoRows.classList.remove('is-hidden');
      makeSlider();
      animateCards();
    }
  } catch (error) {
    clearFields();
    console.log(error);
  }
};

const intersectionObs = new IntersectionObserver((entries, observe) => {
  entries.forEach(async entry => {
    console.log(entry.isIntersecting);
    if (!entry.isIntersecting) {
      return;
    }
    try {
      page += 1;
      const { data } = await fetchPosts(searchValue, page, perPage);
      const totalPages = Math.ceil(data.totalHits / perPage);
      if (page > totalPages) {
        alertEndOfSearch();
        intersectionObs.unobserve(targetElementForInfiniteScroll);
        btnMoveDownOnTwoRows.classList.add('is-hidden');
        return;
      }
      galleryContainer.insertAdjacentHTML('beforeend', createPostCard(data.hits));
      makeSlider();
      animateCards();

    } catch (error) {
      console.log(error);
    }
  });
}, intersectionObsOptions);

formEl.addEventListener('submit', onBtnSubmit);
window.addEventListener('scroll', btnGoTopStatus);
btnGoTop.addEventListener('click', goTop);
btnMoveDownOnTwoRows.addEventListener('click', scrollDownOnTwoRows);

function clearFields() {
  galleryContainer.innerHTML = '';
}

function animateCards () {
  setTimeout(() => {
    const galleryCards = galleryContainer.querySelectorAll('.gallery__link');
    galleryCards.forEach(card => { card.classList.add('animate');
    }, 0);
  });
}