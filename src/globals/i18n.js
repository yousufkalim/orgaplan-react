import i18n from "i18next";
import { initReactI18next } from "react-i18next";
export const getLanguage = () => {
  return i18n.language || "en";
};

export default i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        loginSuccess: "Connexion avec succès!",
        logoutSuccess: "Déconnexion avec succès!",
        registerSuccess: "Enregistrement avec succès!",
        emailSentSuccess: "E-mail envoyé avec succès!",
        registerHeaderPrimary: "Enregistrez-vous",
        loginHeaderPrimary: "Connectez-vous",
        forgotPasswordHeaderPrimary: "Mot de passe oublié?",
        forgotPasswordHeaderSecondary:
          "Informez votre adresse e-mail pour réinitialiser votre mot de passe.",
        submit: "Envoyer",
        register: "S'enregistrer",
        login: "Connexion",
        orLogin: "Ou connecte-vous",
        forgotPassword: "Pas de compte?",
        dontHaveAccount: "Date de naissance?",
        // Placeholders
        companyPlaceholder: "Entreprise",
        emailPlaceholder: "E-mail address",
        firstNamePlaceholder: "Prénom",
        lastNamePlaceholder: "Nom",
        dateOfBirthPlaceholder: "Date de naissance",
        passwordPlaceholder: "Mot de passe",
        phonePlaceholder: "Téléphone",
        confirmPasswordPlaceholder: "Confirmer nouveau mot de p asse",
        // Errors
        emailInvalid: "L'adresse e-mail est incorrecte!",
        passwordInvalid: "Le mot de passe est incorrect!",
        passwordNotMatched: "Le mot de passe doit être identique!",
        required: "Nécessaire",
        storageAreaRequestAccept: "Requête acceptée avec succès",
        storageAreaRequestReject: "Requête rejetée",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
