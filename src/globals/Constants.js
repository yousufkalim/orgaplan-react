const BASE_URL = process.env.REACT_APP_SERVER_URL;
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
  CLIENT_DELETE: BASE_URL_V1 + "superadmin/clients/delete",

  INVOICES: BASE_URL_V1 + "superadmin/invoices",
  INVOICE_DELETE: BASE_URL_V1 + "superadmin/invoices/delete",

  ADMINS: BASE_URL_V1 + "superadmin/admins",
  ADMINS_DELETE: BASE_URL_V1 + "superadmin/admins/delete",

  ZACS: BASE_URL_V1 + "superadmin/zacs",

  SITE: BASE_URL_V1 + "superadmin/sites",
  SITE_ARCHIVE: BASE_URL_V1 + "superadmin/sites/archive",
  SITE_BY_CLIENT: BASE_URL_V1 + "superadmin/sites/client",
  SITE_ARCHIVES: BASE_URL_V1 + "superadmin/sites/archives",
  SITE_UN_ARCHIVE: BASE_URL_V1 + "superadmin/sites/unarchive",

  COMPANY: BASE_URL_V1 + "superadmin/companies",

  BUILDINGS: BASE_URL_V1 + "superadmin/buildings",
  LEVELS: BASE_URL_V1 + "superadmin/levels",
  LEVELS_IMAGE: BASE_URL_V1 + "superadmin/levels/image",
};

export default endpoints;
