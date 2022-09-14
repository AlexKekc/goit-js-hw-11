import axios from 'axios';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchArticles() {
    const config = {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    };

    const API_KEY = '29907532-7f39500d23d88694527ad4fe5';
    const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    return axios.get(URL).then(response => {
      this.page += 1;

      return response.data.hits;
    });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
