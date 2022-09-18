import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '29907532-7f39500d23d88694527ad4fe5';
const BASE_URL = 'https://pixabay.com/api';
const PARAMS = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const URL = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&${PARAMS}&per_page=40&page=${this.page}`;

    return axios.get(URL).then(({ data }) => {
      this.page += 1;

      return { hits: data.hits, totalHits: data.totalHits };
    });
  }

  resetPage() {
    this.page = 1;
  }

  getCurrentPage() {
    return this.page;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
