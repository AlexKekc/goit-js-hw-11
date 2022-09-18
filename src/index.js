import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
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

// function pageScrolling() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

async function waitForFetchRequest() {
  const responce = await imagesApiService.fetchImages();
  return responce;
}

async function searchRequest(event) {
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

  try {
    imagesApiService.resetPage();
    waitForFetchRequest().then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again'
        );
        return;
      }

      refs.loadMoreBtn.classList.remove('is-hidden');
      appendImagesMarkup(hits);
      galleryLightbox.refresh();
      Notify.info(`Hooray! We found ${totalHits} images.`);
    });
  } catch (error) {
    error.message;
  }

  refs.loadMoreBtn.classList.add('is-hidden');
}

async function loadMoreImages(event) {
  try {
    waitForFetchRequest().then(({ hits, totalHits }) => {
      appendImagesMarkup(hits);
      galleryLightbox.refresh();

      if (
        imagesApiService.getCurrentPage() === Math.ceil(totalHits / hits.length)
      ) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        refs.loadMoreBtn.classList.add('is-hidden');
      }
    });
  } catch (error) {
    error.message;
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
