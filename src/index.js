import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

const refs = {
  breedSelectEl: document.querySelector('.breed-select'),
  loaderEl: document.querySelector('.loader'),
  catContainer: document.querySelector('.cat-info'),
  loaderContainer: document.querySelector('.loader-container'),
};

const showLoader = () => {
  refs.loaderEl.style.display = 'block';
  refs.loaderContainer.style.display = 'flex';
};

const hideLoader = () => {
  refs.loaderEl.style.display = 'none';
  refs.loaderContainer.style.display = 'none';
};

const showCatInfo = () => {
  refs.catContainer.style.display = 'block';
};

const hideCatInfo = () => {
  refs.catContainer.style.display = 'none';
};

const createMarkupFromBreeds = breeds => {
  refs.breedSelectEl.innerHTML = breeds
    .map(breed => `<option value="${breed.id}">${breed.name}</option>`)
    .join('');
};
const createMarkupFromCatInformation = cat => {
  const catImage = document.createElement('img');
  catImage.classList.add('cat-image');
  catImage.src = `${cat.url}`;
  catImage.alt = 'Cat image';

  const title = document.createElement('h2');
  const description = document.createElement('p');
  const temperament = document.createElement('p');

  if (cat.breeds && cat.breeds.length > 0) {
    title.textContent = cat.breeds[0].name;
    description.textContent = cat.breeds[0].description;
    temperament.textContent = `Temperament: ${cat.breeds[0].temperament}`;
  } else {
    title.textContent = 'Unknown Breed';
    description.textContent = 'No description available';
    temperament.textContent = 'Temperament: Unknown';
  }

  refs.catContainer.innerHTML = '';
  refs.catContainer.append(catImage, title, description, temperament);
};

const handleSelectChange = () => {
  const breedId = refs.breedSelectEl.value;
  if (breedId) {
    hideCatInfo();
    showLoader();
    fetchCatByBreed(breedId)
      .then(cat => {
        hideLoader();
        showCatInfo();
        createMarkupFromCatInformation(cat);
      })
      .catch(error => {
        Notiflix.Notify.failure(`${error}`);
        throw error;
      });
  }
};
refs.breedSelectEl.addEventListener('change', handleSelectChange);

showLoader();
fetchBreeds()
  .then(breeds => {
    hideLoader();
    createMarkupFromBreeds(breeds, refs);
    const options = [...refs.breedSelectEl.options].map(option => ({
      value: option.value,
      text: option.textContent,
    }));

    if (refs.breedSelectEl.slim) {
      refs.breedSelectEl.slim.destroy();
    }

    refs.breedSelectEl.slim = new SlimSelect({
      select: refs.breedSelectEl,
      data: options,
    });
  })
  .catch(error => {
    Notiflix.Notify.failure(`${error}`);
    throw error;
  });
