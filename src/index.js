import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const inputValue = e.target.value.trim();
  if (inputValue) {
    clearInfo();
    fetchCountries(inputValue)
      .then(countries => {
        switch (true) {
          case countries.length > 10:
            Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
            break;
          case countries.length > 1 && countries.length <= 10:
            putCountries(countries);
            break;
          case countries.length === 1:
            putCountry(countries[0]);
            break;
          default:
            break;
        }
      })
      .catch(err => {
        console.error(err);
        Notify.failure('Oops, there is no country with that name');
      });
  } else {
    clearInfo();
  }
}

function clearInfo() {
  console.log('Clearing');
  countryList.replaceChildren();
  countryInfo.replaceChildren();
}

function putCountries(countries) {
  const listHTML = countries
    .map(
      ({ name, flags }) =>
        `<li class="country"><img src="${
          flags.png
        }" alt="${`Flag of ${name.common}" width="32"`}>${name.common}</li>`
    )
    .join('');
  countryList.innerHTML = listHTML;
}

function putCountry(country) {
  const { name, flags, capital, population } = country;
  const languages = Object.values(country.languages).join(', ');
  const html = `<div class="country-name">
    <img src="${flags.png}" alt="${`Flag of ${name.common}" width="32"`}>
    <h1>${name.common}</h1>
    </div>
    <span><strong>Capital</strong>: ${capital}</span>
    <span><strong>Population</strong>: ${population}</span>
    <span><strong>Languages</strong>: ${languages}</span>`;
  countryInfo.innerHTML = html;
}
