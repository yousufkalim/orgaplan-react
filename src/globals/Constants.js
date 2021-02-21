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
  CLIENTS: BASE_URL_V1 + "superadmin/clients",
  CLIENTS_VERIFY: BASE_URL_V1 + "superadmin/clients/verify",
};

export default endpoints;
