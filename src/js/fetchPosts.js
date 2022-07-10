import axios from 'axios';

const API_KEY = '28531485-c2ddecdafcd3c65a85d6ac636';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchPosts = (query, page, limitPerPage) => {
  return axios.get(`${BASE_URL}`, {
    params: {
      q: `${query}`,
      key: `${API_KEY}`,
      per_page: `${limitPerPage}`,
      page: `${page}`,
      image_type: 'photo',
      orientation: 'gorizontal',
      safesearch: true,
    },
  });
};