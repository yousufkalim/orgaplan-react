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

  SITES: BASE_URL_V1 + "superadmin/sites",
  SITES_GET: BASE_URL_V1 + "superadmin/sites/get",
  SITE_ARCHIVE: BASE_URL_V1 + "superadmin/sites/archive",
  SITE_BY_CLIENT: BASE_URL_V1 + "superadmin/sites/client",
  SITE_ARCHIVES: BASE_URL_V1 + "superadmin/sites/archives",
  SITE_UN_ARCHIVE: BASE_URL_V1 + "superadmin/sites/unarchive",

  COMPANY: BASE_URL_V1 + "superadmin/companies",

  BUILDINGS: BASE_URL_V1 + "superadmin/buildings",
  BUILDINGS_BY_SITE: BASE_URL_V1 + "superadmin/buildings/site",
  LEVELS: BASE_URL_V1 + "superadmin/levels",
  LEVELS_BUILDING: BASE_URL_V1 + "superadmin/levels/building",
  LEVELS_IMAGE: BASE_URL_V1 + "superadmin/levels/image",

  GET_LIST_OF_MEANS: BASE_URL_V1 + "mean/get_list_of_means",
  GET_ADD_MEAN: BASE_URL_V1 + "mean/get_add_mean",
  FILTER_MEANS: BASE_URL_V1 + "mean/filter",
  GET_EXTERIOR_MEANS: BASE_URL_V1 + "get_exterior_means/enterprise",
  GET_LEVELS: BASE_URL_V1 + "level/get_levels_by_building",
  GET_STORAGE_AREA_BY_LEVEL_ID:
    BASE_URL_V1 + "storage-area/get_by_level_id/enterprise",

  CREATE_MEAN: BASE_URL_V1 + "mean",
};

export default endpoints;
