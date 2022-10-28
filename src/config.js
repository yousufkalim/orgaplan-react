let baseUrl = 'http://localhost:5001/';

if (window.location.host === 'orgaplan-dev.falconweb.app') {
  baseUrl = 'https://orgaplan-api-dev.falconweb.app/';
} else if (window.location.host === 'orgaplan-qa.falconweb.app') {
  baseUrl = 'https://orgaplan-api-qa.falconweb.app/';
} else if (window.location.host === 'orgaplan-staging.falconweb.app') {
  baseUrl = 'https://orgaplan-api-staging.falconweb.app/';
} else if (
  window.location.host === 'orgaplansa.com' ||
  window.location.host === 'www.orgaplansa.com'
) {
  baseUrl = 'https://api.orgaplansa.com/';
}

module.exports = { baseUrl };
