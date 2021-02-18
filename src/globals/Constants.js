// const BASE_URL = 'https://cors-anywhere.herokuapp.com/http://localhost:5000';
const BASE_URL = "http://localhost:5000/api/v1/";

const endpoints = {
  BASE_URL,

  // Auth
  LOGIN: BASE_URL + "auth/sign-in",
  REGISTER_USER: BASE_URL + "auth/sign-up",
  GET_PROFILE: BASE_URL + "auth/get-profile-by-jwt",

  // SUPERADMIN
  GET_CLIENTS: BASE_URL + "superadmin/clients",
};

export default endpoints;
