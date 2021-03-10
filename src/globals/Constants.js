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
  ADMINS: BASE_URL_V1 + "superadmin/admins",
  ADMIN_GET: BASE_URL_V1 + "superadmin/admins/get",
  ADMIN_DELETE: BASE_URL_V1 + "superadmin/admins/delete",
  ADMIN_REGISTRATION: BASE_URL_V1 + "superadmin/admins/complete-registeration",
  BUILDINGS: BASE_URL_V1 + "superadmin/buildings",
  BUILDINGS_BY_SITE: BASE_URL_V1 + "superadmin/buildings/site",
  COMPANY: BASE_URL_V1 + "superadmin/companies",
  CLIENTS: BASE_URL_V1 + "superadmin/clients",
  CLIENT_DELETE: BASE_URL_V1 + "superadmin/clients/delete",
  DASHBOARD: BASE_URL_V1 + "superadmin/dashboard",
  INVOICE: BASE_URL_V1 + "superadmin/invoices/get",
  INVOICES: BASE_URL_V1 + "superadmin/invoices",
  INVOICES_BY_CLIENT: BASE_URL_V1 + "superadmin/invoices/client",
  INVOICE_DELETE: BASE_URL_V1 + "superadmin/invoices/delete",
  LEVELS: BASE_URL_V1 + "superadmin/levels",
  LEVEL_IMAGE: BASE_URL_V1 + "superadmin/levels/image",
  LEVELS_BUILDING: BASE_URL_V1 + "superadmin/levels/building",
  QUOTE_VERIFY: BASE_URL_V1 + "superadmin/quotes/verify",
  SITES: BASE_URL_V1 + "superadmin/sites",
  SITE_GET: BASE_URL_V1 + "superadmin/sites/get",
  SITE_DELETE: BASE_URL_V1 + "superadmin/sites/delete",
  SITE_ARCHIVE: BASE_URL_V1 + "superadmin/sites/archive",
  SITES_BY_CLIENT: BASE_URL_V1 + "superadmin/sites/client",
  SITE_ARCHIVES: BASE_URL_V1 + "superadmin/sites/archives",
  SITE_UN_ARCHIVE: BASE_URL_V1 + "superadmin/sites/unarchive",
  ZACS: BASE_URL_V1 + "superadmin/zacs",
  ZAC_DELETE: BASE_URL_V1 + "superadmin/zacs/delete",

  // ADMIN
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
