import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import API from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener(
  'input',
  debounce(onInpupCountry, DEBOUNCE_DELAY)
);

function onInpupCountry() {
  resetResult();
  const imputCountry = countryInput.value.trim();
  API.fetchCountries(imputCountry).then(resultCounriesData).catch(onFetchError);
}

function resetResult() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function resultCounriesData(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length >= 2 && data.length <= 10) {
    const country = data
      .map(
        ({ name, flags }) =>
          `<li style="display: flex;
          align-items: center;
          font-size: 15px;"><img src="${flags.svg}" alt="${name.official}" width=25px height=auto style="display:block; margin-right: 30px;">${name.official}</li>`
      )
      .join('');
    countryList.insertAdjacentHTML('beforeend', country);
  } else if (data.length === 1) {
    const country = data
      .map(
        ({ name, flags }) =>
          `<li style="display: flex;
          align-items: center;
          font-size: 30px;"><img src="${flags.svg}" alt="${name.official}" width=50px height=auto style="display:block; margin-right: 30px;">${name.official}</li>`
      )
      .join('');
    countryList.insertAdjacentHTML('beforeend', country);
    const countryInformation = data
      .map(
        ({ capital, population, languages}) =>
          `<ul>
        <li>
          <b>Capital:</b>
      ${capital}
        </li>
        <li>
          <b>Population:</b>
          ${population}
        </li>
        <li>
          <b>Languages:</b>
          ${Object.values(languages).join(", ")}
        </li>
      </ul>`
      )
      .join('');
    countryInfo.insertAdjacentHTML('beforeend', countryInformation);
  }
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
