import axios from 'axios';

const API_KEY =
  'live_oUnYnT5YOqwNEHvPYLq1EkPY1ebhADG5wJ0qdhE8LQ5KmWSgSKJ99aofz18heE6i';
const BASE_URL = 'https://api.thecatapi.com/v1';

axios.defaults.headers.common['x-api-key'] = API_KEY;

export function fetchBreeds() {
  const url = `${BASE_URL}/breeds`;
  return axios.get(url).then(response => response.data);
}

export function fetchCatByBreed(breedId) {
  const url = `${BASE_URL}/images/search?breed_ids=${breedId}`;
  return axios.get(url).then(response => response.data[0]);
}
