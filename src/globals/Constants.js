const BASE_URL = process.env.REACT_APP_SERVER_URL;
const BASE_URL_V1 = BASE_URL + "api/v1/";

const endpoints = {
  BASE_URL,
  BASE_URL_V1,

  // Auth
  LOGIN: BASE_URL_V1 + "auth/sign-in",
  REGISTER_USER: BASE_URL_V1 + "auth/sign-up",
  GET_PROFILE: BASE_URL_V1 + "auth/get-profile-by-jwt",
  VALIDATE_TOKEN: BASE_URL_V1 + "auth/validate-token",

  // SUPERADMIN
  ADMINS: BASE_URL_V1 + "superadmin/admins",
  ADMIN_GET: BASE_URL_V1 + "superadmin/admins/get",
  ADMIN_DELETE: BASE_URL_V1 + "superadmin/admins/delete",
  ADMIN_REGISTRATION: BASE_URL_V1 + "superadmin/admins/complete-registeration",
  BUILDINGS: BASE_URL_V1 + "superadmin/buildings",
  BUILDINGS_BY_SITE: BASE_URL_V1 + "superadmin/buildings/site",
  COMPANY: BASE_URL_V1 + "superadmin/companies",
  COMPANY_GET: BASE_URL_V1 + "superadmin/companies/get",
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
  QUOTE: BASE_URL_V1 + "superadmin/quotes",
  QUOTE_VERIFY: BASE_URL_V1 + "superadmin/quotes/verify",
  SITES: BASE_URL_V1 + "superadmin/sites",
  SITE_GET: BASE_URL_V1 + "superadmin/sites/get",
  SITE_DELETE: BASE_URL_V1 + "superadmin/sites/delete",
  SITE_ARCHIVE: BASE_URL_V1 + "superadmin/sites/archive",
  SITES_BY_ADMIN: BASE_URL_V1 + "superadmin/sites/admin",
  SITES_BY_CLIENT: BASE_URL_V1 + "superadmin/sites/client",
  SITE_ARCHIVES: BASE_URL_V1 + "superadmin/sites/archives",
  SITE_UN_ARCHIVE: BASE_URL_V1 + "superadmin/sites/unarchive",
  ZACS: BASE_URL_V1 + "superadmin/zacs",
  ZAC_DELETE: BASE_URL_V1 + "superadmin/zacs/delete",

  // ADMIN
  ADMIN_PIC: BASE_URL_V1 + "pic",
  ADMIN_PIC_GET: BASE_URL_V1 + "pic/get",
  ADMIN_PIC_SHAPE: BASE_URL_V1 + "pic/shape",
  ADMIN_PIC_BY_SITE: BASE_URL_V1 + "pic/site",

  MEAN: BASE_URL_V1 + "mean",
  SITE_MEANS: BASE_URL_V1 + "mean/get_site_means",

  CREATE_STORAGE_AREA: BASE_URL_V1 + "storage-area",
  CREATE_DELIVERY_AREA: BASE_URL_V1 + "delivery-area",

  SITE_VEHICLES: BASE_URL_V1 + "vehicles/get_site_vehicles",

  GET_USER_SITES: BASE_URL_V1 + "user-sites/user",
  GET_LIST_OF_MEANS: BASE_URL_V1 + "mean/get_list_of_means",
  GET_ADD_MEAN: BASE_URL_V1 + "mean/get_add_mean",
  FILTER_MEANS: BASE_URL_V1 + "mean/filter",
  GET_EXTERIOR_MEANS: BASE_URL_V1 + "mean/get_exterior_means",
  GET_LEVELS: BASE_URL_V1 + "level/get_levels_by_building",
  GET_STORAGE_AREA_BY_LEVEL_ID:
    BASE_URL_V1 + "storage-area/get_by_level_id/enterprise",

  GET_STORAGE_AREA_BY_SITE_ID:
    BASE_URL_V1 + "storage-area/get_storage_site/enterprise",
  GET_DELIVERY_AREA_BY_SITE_ID:
    BASE_URL_V1 + "delivery-area/get_delivery_area_site/enterprise",
  UPDATE_MEAN: BASE_URL_V1 + "mean",
  GET_MEAN_HISTORY: BASE_URL_V1 + "mean_booking",
  getBookingBySiteId: BASE_URL_V1 + "mean_booking/getBookingBySiteId",

  FILTER_BOOKING: BASE_URL_V1 + "mean_booking/filter",

  GET_SITE_COMPANIES: BASE_URL_V1 + "company-sites",
  GET_COMPANY_USERS: BASE_URL_V1 + "company/company_user",
  FILTER_COMPANY_SITES: BASE_URL_V1 + "company-sites/filter",

  GET_ADD_USER: BASE_URL_V1 + "users/add_user",
  GET_USER_COMPANY: BASE_URL_V1 + "users/get_user_company",
  GET_ADD_COMPANY: BASE_URL_V1 + "company-sites/add_company",

  ADD_USER_ADMIN: BASE_URL_V1 + "users/admin/add_user",
  ADD_COMPANY_USER: BASE_URL_V1 + "users/add_company_user",
  UPDATE_COMPANY_USER: BASE_URL_V1 + "users/update_company_user",

  GET_SITE_ORGANIGRAMMES: BASE_URL_V1 + "organigramme/site",
  DELETE_SITE_ORGANIGRAMMES: BASE_URL_V1 + "organigramme/delete",
  POST_SITE_ORGANIGRAMMES: BASE_URL_V1 + "organigramme",
  PUT_SITE_ORGANIGRAMMES: BASE_URL_V1 + "organigramme/update",

  GET_SITE_INCIDENT: BASE_URL_V1 + "incidents/admin",
  GET_ALL_SITE_INCIDENT: BASE_URL_V1 + "incidents",
  GET_COMPANY_AUTOFILL: BASE_URL_V1 + "company-sites/autofill",
  GET_GENERAL_CONTRACTOR: BASE_URL_V1 + "company-sites/general-contractor",

  CREATE_COMPANY: BASE_URL_V1 + "company",
  POST_ADD_SITE_INCIDENTS: BASE_URL_V1 + "incidents",
  CREATE_BOOKING_MEAN: BASE_URL_V1 + "mean_booking",
  Update_BOOKING_MEAN: BASE_URL_V1 + "mean_booking",
  Delete_BOOKING_MEAN: BASE_URL_V1 + "mean_booking",
  GET_ALL_SITE_INCIDENTS: BASE_URL_V1 + "incidents/admin/incident_list",

  FILTER_INCIDENT: BASE_URL_V1 + "incidents/filter",
  getBuildingsBySiteId: BASE_URL_V1 + "building/get_by_site_id",
  getDeliveryAreaSiteBySiteId:
    BASE_URL_V1 + "delivery-area/get_delivery_area_site/enterprise",
  getStorageSiteBysiteId:
    BASE_URL_V1 + "storage-area/get_all_storage_site/enterprise",
  filterBookingCalendar: BASE_URL_V1 + "mean_booking/filter_Booking_calendar",
  FILTER_USER: BASE_URL_V1 + "users/filter",

  GET_ALL_USERS: BASE_URL_V1 + "users",
  FILE_UPLOAD: BASE_URL_V1 + "file-upload",
};
export default endpoints;
