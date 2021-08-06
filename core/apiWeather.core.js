const r2 = require('r2');
const querystring = require('query-string');

const API_URL = 'https://api.openweathermap.org/';
const API_KEY = process.env.API_WEATHER;

const qp = {
  id: 498817,
  appid: API_KEY,
  lang: 'ru',
  units: 'metric',
};

const query = querystring.stringify(qp);
const url = API_URL + `data/2.5/weather?${query}`;

const getWeather = () => {
  return r2.get(url).json;
};

module.exports = getWeather;
