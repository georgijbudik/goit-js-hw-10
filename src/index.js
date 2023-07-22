import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

const refs = {
  breedSelectEl: document.querySelector('.breed-select'),
  loaderEl: document.querySelector('.loader'),
  catContainer: document.querySelector('.cat-info'),
  loaderContainer: document.querySelector('.loader-container'),
};

let isCatInfoShown = false;

const showLoader = () => {
  refs.loaderEl.style.display = 'block';
  refs.loaderContainer.style.display = 'display';
};

const hideLoader = () => {
  refs.loaderEl.style.display = 'none';
  refs.loaderContainer.style.display = 'none';
};

const showCatInfo = () => {
  if (isCatInfoShown) refs.catContainer.style.display = 'block';
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
  const { url, breeds } = cat;
  const catImage = document.createElement('img');
  catImage.classList.add('cat-image');
  catImage.src = `${url}`;
  catImage.alt = 'Cat image';

  const title = document.createElement('h2');
  const description = document.createElement('p');
  const temperament = document.createElement('p');

  if (breeds && breeds.length > 0) {
    const {
      name,
      description: breedDescription,
      temperament: breedTemperament,
    } = breeds[0];
    title.textContent = name;
    description.textContent = breedDescription;
    temperament.textContent = `Temperament: ${breedTemperament}`;
  } else {
    title.textContent = 'Unknown Breed';
    description.textContent = 'No description available';
    temperament.textContent = 'Temperament: Unknown';
  }

  refs.catContainer.innerHTML = '';
  refs.catContainer.append(catImage, title, description, temperament);
};

const showLoaderAndFetchBreeds = () => {
  showLoader();
  fetchBreeds()
    .then(breeds => {
      hideLoader();
      createMarkupFromBreeds(breeds);
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
      showErrorMessage(`${error}`);
      throw error;
    });
};

const showErrorMessage = message => Notiflix.Notify.failure(message);

const handleSelectChange = () => {
  const breedId = refs.breedSelectEl.value;
  if (!breedId) return;
  hideCatInfo();
  showLoader();
  fetchCatByBreed(breedId)
    .then(cat => {
      hideLoader();
      if (!cat) {
        showErrorMessage('Cat information not found.');
        return;
      }
      showCatInfo();
      createMarkupFromCatInformation(cat);
      isCatInfoShown = true;
    })
    .catch(error => {
      showErrorMessage(`${error}`);
      throw error;
    });
};

refs.breedSelectEl.addEventListener('change', handleSelectChange);
showLoaderAndFetchBreeds();
