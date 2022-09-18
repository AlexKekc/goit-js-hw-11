import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './js/components/image-service';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-btn'),
};

const imagesApiService = new ImagesApiService();
const galleryLightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', searchRequest);
refs.loadMoreBtn.addEventListener('click', loadMoreImages);

function pageScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function searchRequest(event) {
  event.preventDefault();

  cleanImagesMarkup();
  imagesApiService.query = event.currentTarget.elements.searchQuery.value;

  if (imagesApiService.query === '') {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notify.failure(
      'Oops, probably your input field is empty. Please try again.'
    );
    return;
  }

  imagesApiService.resetPage();
  imagesApiService.fetchArticles().then(({ hits, totalHits }) => {
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );
      return;
    }

    refs.loadMoreBtn.classList.remove('is-hidden');
    appendImagesMarkup(hits);
    galleryLightbox.refresh();
    pageScrolling();
    Notify.info(`Hooray! We found ${totalHits} images.`);
  });

  refs.loadMoreBtn.classList.add('is-hidden');
}

function loadMoreImages(event) {
  imagesApiService.fetchArticles().then(({ hits, totalHits }) => {
    appendImagesMarkup(hits);
    galleryLightbox.refresh();
    pageScrolling();
  });

  if (imagesApiService.getPage() === 13) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.classList.add('is-hidden');
  }
}

function appendImagesMarkup(hits) {
  const markup = hits
    .map(hit => {
      return `
      <a class="gallery_item" href="${hit.largeImageURL}">
        <div class="photo-card">
          <img class="gallery_img" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span>${hit.likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span>${hit.views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span>${hit.comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span>${hit.downloads}</span>
            </p>
          </div>
        </div>
      </a>`;
    })
    .join('');

  return refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function cleanImagesMarkup() {
  refs.gallery.innerHTML = '';
}
