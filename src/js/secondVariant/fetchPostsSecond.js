
export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28531485-c2ddecdafcd3c65a85d6ac636';

  constructor() {
    this.query = null;
    this.page = 1;
    this.limitPerPage = 40;
  }

  fetchPosts() {
    const searchParams = new URLSearchParams({
      q: this.query,
      page: this.page,
      per_page: this.limitPerPage,
      image_type: 'photo',
      orientation: 'gorizontal',
      safesearch: 'true',
    });
    return fetch(`${this.#BASE_URL}?key=${this.#API_KEY}&${searchParams}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      });
  }
}
