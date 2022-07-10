import axios from 'axios';

const API_KEY = '28531485-c2ddecdafcd3c65a85d6ac636';
const BASE_URL = 'https://pixabay.com/api/';

// export const fetchPost = (post, page) => {
//   return fetch(`${BASE_URL}?key=${API_KEY}&q=${post}&page=${page}&per_page=40&image_type=photo&orientation=gorizontal&safesearch=true`)
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   })
// }

export const startFetchPosts = (query, page) => {
  return axios.get(`${BASE_URL}`, {
    params: {
      q: `${query}`,
      key: `${API_KEY}`,
      per_page: 40,
      page: `${page}`,
      image_type: 'photo',
      orientation: 'gorizontal',
      safesearch: true,
    },
  });
};

export const continueFetchPosts = page => {
  return axios.get(`${BASE_URL}`, {
    params: {
      key: `${API_KEY}`,
      per_page: 12,
      page: `${page}`,
      image_type: 'photo',
      orientation: 'gorizontal',
      safesearch: true,
    },
  });
};
