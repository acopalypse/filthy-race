const r2 = require('r2');
const querystring = require('query-string');

const API_URL = 'https://api.thecatapi.com/';
const API_KEY = process.env.API_KEY;

const headers = {
  'x-api-key': API_KEY,
};
const qp = {
  has_breeds: false,
  mime_types: 'gif',
  size: 'small',
  limit: 1,
};
const query = querystring.stringify(qp);
const url = API_URL + `v1/images/search?${query}`;

const getImage = () => {
  return r2.get(url, { headers }).json;
};

module.exports = getImage;
