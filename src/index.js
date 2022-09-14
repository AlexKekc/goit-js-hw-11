import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './js/components/image-service';

// Notify.failure("Sorry, there are no images matching your search query. Please try again.");
// Notify.info("We're sorry, but you've reached the end of search results.");
// Notify.info(`Hooray! We found ${totalHits} images.`);

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('button[type=button]'),
};

const imagesApiService = new ImagesApiService();

refs.form.addEventListener('submit', searchRequest);
refs.loadMoreBtn.addEventListener('click', loadMoreImages);

function searchRequest(event) {
  event.preventDefault();

  imagesApiService.query = event.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPage();
  imagesApiService.fetchArticles().then(appendImagesMarkup);
}

function loadMoreImages(event) {
  imagesApiService.fetchArticles().then(appendImagesMarkup);
}

function appendImagesMarkup(hits) {
  const markup = hits
    .map(hit => {
      return `<div class="photo-card">
  <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${hit.likes}</b>
    </p>
    <p class="info-item">
      <b>${hit.views}</b>
    </p>
    <p class="info-item">
      <b>${hit.comments}</b>
    </p>
    <p class="info-item">
      <b>${hit.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');

  console.log(markup);

  refs.gallery.insertAdjacentElement('beforeend', markup);
}
