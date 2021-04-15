const BASE_URL = process.env.REACT_APP_SERVER_URL;
const BASE_URL_V1 = BASE_URL + "api/v1/";

const endpoints = {
  // ================================ GENERAL ================================
  BASE_URL,
  BASE_URL_V1,
  FILE_SIZE: 10485760,
  FILE_UPLOAD: BASE_URL_V1 + "file-upload",

  // ================================ AUTH ================================
  USER_GET: BASE_URL_V1 + "auth/get",
  LOGIN: BASE_URL_V1 + "auth/sign-in",
  REGISTER_USER: BASE_URL_V1 + "auth/sign-up",
  GET_PROFILE: BASE_URL_V1 + "auth/get-profile-by-jwt",
  VALIDATE_TOKEN: BASE_URL_V1 + "auth/validate-token",
  RESEND_EMAIL_VERIFICATION: BASE_URL_V1 + "auth/request-email-verification",

  // ================================ SUPERADMIN ================================
  // ADMIN
  ADMINS: BASE_URL_V1 + "superadmin/admins",
  ADMIN_GET: BASE_URL_V1 + "superadmin/admins/get",
  ADMIN_DELETE: BASE_URL_V1 + "superadmin/admins/delete",
  ADMIN_REGISTRATION: BASE_URL_V1 + "superadmin/admins/complete-registeration",
  // BUILDING
  BUILDINGS: BASE_URL_V1 + "superadmin/buildings",
  BUILDINGS_BY_SITE: BASE_URL_V1 + "superadmin/buildings/site",
  // COMPANY
  COMPANY: BASE_URL_V1 + "superadmin/companies",
  COMPANY_GET: BASE_URL_V1 + "superadmin/companies/get",
  // CLIENT
  CLIENTS: BASE_URL_V1 + "superadmin/clients",
  CLIENT_DELETE: BASE_URL_V1 + "superadmin/clients/delete",
  // DASHBOARD
  DASHBOARD: BASE_URL_V1 + "superadmin/dashboard",
  // INVOICE
  INVOICE: BASE_URL_V1 + "superadmin/invoices/get",
  INVOICES: BASE_URL_V1 + "superadmin/invoices",
  INVOICES_BY_CLIENT: BASE_URL_V1 + "superadmin/invoices/client",
  INVOICE_DELETE: BASE_URL_V1 + "superadmin/invoices/delete",
  // LEVEL
  LEVELS: BASE_URL_V1 + "superadmin/levels",
  LEVEL_IMAGE: BASE_URL_V1 + "superadmin/levels/image",
  LEVELS_BUILDING: BASE_URL_V1 + "superadmin/levels/building",
  // QUOTE
  QUOTE: BASE_URL_V1 + "superadmin/quotes",
  QUOTE_VERIFY: BASE_URL_V1 + "superadmin/quotes/verify",
  // SITE
  SITES: BASE_URL_V1 + "superadmin/sites",
  SITE_GET: BASE_URL_V1 + "superadmin/sites/get",
  SITE_DELETE: BASE_URL_V1 + "superadmin/sites/delete",
  SITE_ARCHIVE: BASE_URL_V1 + "superadmin/sites/archive",
  SITES_BY_ADMIN: BASE_URL_V1 + "superadmin/sites/admin",
  SITES_BY_CLIENT: BASE_URL_V1 + "superadmin/sites/client",
  SITE_ARCHIVES: BASE_URL_V1 + "superadmin/sites/archives",
  SITE_UN_ARCHIVE: BASE_URL_V1 + "superadmin/sites/unarchive",
  // ZAC
  ZACS: BASE_URL_V1 + "superadmin/zacs",
  ZAC_DELETE: BASE_URL_V1 + "superadmin/zacs/delete",

  // ================================ ADMIN ================================
  // PIC
  ADMIN_PIC: BASE_URL_V1 + "pic",
  ADMIN_PIC_GET: BASE_URL_V1 + "pic/get",
  ADMIN_PIC_SHAPE: BASE_URL_V1 + "pic/shape",
  ADMIN_PIC_BY_SITE: BASE_URL_V1 + "pic/site",

  // MEANS
  MEAN: BASE_URL_V1 + "mean",
  UPDATE_MEAN: BASE_URL_V1 + "mean",
  GET_MEAN_HISTORY: BASE_URL_V1 + "mean_booking",
  SITE_MEANS: BASE_URL_V1 + "mean/get_site_means",
  GET_ADD_MEAN: BASE_URL_V1 + "mean/get_add_mean",
  GET_LIST_OF_MEANS: BASE_URL_V1 + "mean/get_list_of_means",

  // STORAGE AREA
  CREATE_STORAGE_AREA: BASE_URL_V1 + "storage-area",
  GET_STORAGE_AREA_MEANS: BASE_URL_V1 + "storage-area/means",
  GET_STORAGE_AREAS_BY_SITE: BASE_URL_V1 + "storage-area/site",
  GET_STORAGE_AREA_BY_SITE_ID: BASE_URL_V1 + "storage-area/get_storage_site",

  // DELIVERY AREA
  CREATE_DELIVERY_AREA: BASE_URL_V1 + "delivery-area",
  GET_DELIVERY_AREA_MEANS: BASE_URL_V1 + "delivery-area/delivery-area-means",
  GET_DELIVERY_AREA_BY_SITE_ID:
    BASE_URL_V1 + "delivery-area/get_delivery_area_site/enterprise",

  // DELIVERY
  DELIVERY: BASE_URL_V1 + "delivery",

  SITE_VEHICLES: BASE_URL_V1 + "vehicles/get_site_vehicles",

  GET_USER_SITES: BASE_URL_V1 + "user-sites/user",
  FILTER_MEANS: BASE_URL_V1 + "mean/filter",
  GET_LEVELS: BASE_URL_V1 + "level/get_levels_by_building",

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
  filterBookingCalendar: BASE_URL_V1 + "mean_booking/filter_Booking_calendar",
  FILTER_USER: BASE_URL_V1 + "users/filter",

  GET_ALL_USERS: BASE_URL_V1 + "users",
};
export default endpoints;
