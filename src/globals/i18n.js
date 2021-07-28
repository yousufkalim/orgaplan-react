import i18n from "i18next";
import { initReactI18next } from "react-i18next";
export const getLanguage = () => {
  return i18n.language || "en";
};

export default i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        loginSuccess: "Login was successful!",
        logoutSuccess: "Logout was successful!",
        registerSuccess: "Registration was successful!",
        emailSentSuccess: "Email sent successfully!",
        registerHeaderPrimary: "Register your account",
        loginHeaderPrimary: "Login to your account",
        forgotPasswordHeaderPrimary: "Forgot Password?",
        forgotPasswordHeaderSecondary: "Enter your email to reset password",
        submit: "Envoyer",
        register: "REGISTER",
        login: "Connexion",
        orLogin: "Or Login Now",
        forgotPassword: "Forgot Password ?",
        dontHaveAccount: "Don't have an account?",
        // Placeholders
        companyPlaceholder: "Entreprise",
        emailPlaceholder: "E-mail address",
        firstNamePlaceholder: "Prénom",
        lastNamePlaceholder: "Nom",
        dateOfBirthPlaceholder: "Date of Birth",
        passwordPlaceholder: "Mot de passe",
        phonePlaceholder: "Téléphone",
        confirmPasswordPlaceholder: "Confirmer nouveau mot de p asse",
        // Errors
        emailInvalid: "Email is invalid!",
        passwordInvalid: "Password is invalid!",
        passwordNotMatched: "Password must match!",
        required: "Required",
        storageAreaRequestAccept: "Request accept successfuly",
        storageAreaRequestReject: "Request rejected",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
