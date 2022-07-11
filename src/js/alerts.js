import { Notify } from 'notiflix/build/notiflix-notify-aio';
export  function alertAmountImagesFound(data) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }
  
export  function alertNoEmptySearch() {
    Notify.failure('The search cannot be empty. Please make correct query.');
  }
  
export  function alertNoImagesFound() {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
  
export  function alertEndOfSearch() {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }