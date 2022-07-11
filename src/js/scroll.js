const marginBetweenCards = 15;

export function scrollDownOnTwoRows() {
  const cardSizeAndCoordinates = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
  const { height: cardHeight } = cardSizeAndCoordinates;
  console.log(`Высота карточки(heigth) теперь имеет название cardHeight:`, cardHeight);
  window.scrollBy({
    top: cardHeight * 2 + marginBetweenCards * 2,
    behavior: 'smooth',
  });
}

export function btnGoTopStatus() {
  const cardSizeAndCoordinates = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
  const { height: cardHeight } = cardSizeAndCoordinates;
  const btnGoTop = document.querySelector('.btn-move-up');
  if (window.pageYOffset > cardHeight + marginBetweenCards) {
    btnGoTop.classList.remove('is-hidden');
  } else 
  { btnGoTop.classList.add('is-hidden')
};
}

export function goTop() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
