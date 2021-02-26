// const BASE_URL = 'https://cors-anywhere.herokuapp.com/http://localhost:5000';
const BASE_URL = "http://localhost:5000/";
const BASE_URL_V1 = BASE_URL + "api/v1/";

const endpoints = {
  BASE_URL,
  BASE_URL_V1,

  // Auth
  LOGIN: BASE_URL_V1 + "auth/sign-in",
  REGISTER_USER: BASE_URL_V1 + "auth/sign-up",
  GET_PROFILE: BASE_URL_V1 + "auth/get-profile-by-jwt",

  // SUPERADMIN
  QUOTE_VERIFY: BASE_URL_V1 + "superadmin/quotes/verify",
  CLIENTS: BASE_URL_V1 + "superadmin/clients",
  INVOICES: BASE_URL_V1 + "superadmin/invoices",
  ADMINS: BASE_URL_V1 + "superadmin/admins",
  ZACS: BASE_URL_V1 + "superadmin/zacs",
  SITE: BASE_URL_V1 + "superadmin/sites",
  SITE_ARCHIVE: BASE_URL_V1 + "superadmin/sites/archive",
  SITE_UN_ARCHIVE: BASE_URL_V1 + "superadmin/sites/unarchive",
  SITE_ARCHIVES: BASE_URL_V1 + "superadmin/sites/archives",
  COMPANY: BASE_URL_V1 + "superadmin/companies",
};

export default endpoints;
