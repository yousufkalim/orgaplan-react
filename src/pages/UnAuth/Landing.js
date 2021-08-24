import React, { useState } from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";

import "./Landing.css";
import GLOBALS from "../../globals";
import Modal from "../../components/Modal";
import { Images } from "../../assets/Assets";
import FormInput from "../../components/FormInput";
import CustomButton from "../../components/Button";
import { TEXTS } from "../../assets/languages/french";
import Actions from "../../redux/actions";

export default function LandingPage() {
  const {
    LOGIN,
    MESSAGE,
    SUBMIT,
    Your_request_has_been_received,
    You_will_be_contacted_soon,
  } = TEXTS;
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [quoteMessage, setQuoteMessage] = useState("");
  const [quoteMessageType, setQuoteMessageType] = useState("success");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    company: "",
    phone: "",
    email: "",
    message: "",
  });
  const { name, city, company, phone, email, message } = formData;
  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(
      Actions.notistack.enqueueSnackbar(
        Actions.notistack.snackbar(
          "Votre demande a bien été prise en compte, nous vous reviendrons vers vous au plus vite. ",
          "success",
        ),
      ),
    );
    GLOBALS.API({
      method: "POST",
      uri: GLOBALS.Constants.CONTACTUS,
      body: JSON.stringify(formData),
    }).then(() => {
      setFormData({
        name: "",
        city: "",
        company: "",
        phone: "",
        email: "",
        message: "",
      });
    });
  };

  async function onQuoteSubmit(values, { setSubmitting }) {
    try {
      const formdata = JSON.stringify({
        name: values.company,
        city: values.city,
        firstName: values.name,
        lastName: "",
        phone: values.phone,
        email: values.email,
        contractType: "CLIENTPERSITE",
        description: values.message,
      });

      await GLOBALS.API({
        method: "POST",
        uri: GLOBALS.Constants.QUOTE,
        body: formdata,
      });
      setQuoteMessageType("success");
      setQuoteMessage(
        `${Your_request_has_been_received}. ${You_will_be_contacted_soon}.`,
      );
      setSubmitting(false);
    } catch (err) {
      setQuoteMessageType("error");
      setSubmitting(false);
      setQuoteMessage(err.message);
    }
  }
  return (
    <>
      <div className="land-container">
        <div className="hero">
          <div className="d-flex justify-content-between p-1">
            <nav className="d-flex justify-content-between align-self-start pt-3 w-50">
              <Link
                onClick={() => {
                  window.location.reload();
                }}
              >
                <img src={Images.logo} className="hero-logo" alt="logo" />
              </Link>

              <Link
                onClick={() => {
                  window.scroll({
                    top: document.body.offsetHeight,
                    left: 0,
                    behavior: "smooth",
                  });
                }}
                className="text-white"
              >
                Fonctionnalites
              </Link>
              <Link
                onClick={() => setShowQuoteModal((st) => !st)}
                className="text-white"
              >
                S'inscrire
              </Link>
              <Link
                onClick={() => {
                  window.scroll({
                    top: 2100,
                    left: 0,
                    behavior: "smooth",
                  });
                }}
                className="text-white"
              >
                Nous contacter
              </Link>
            </nav>
            <div className="text-center text-black-50">
              {store.auth && (
                <img
                  src={Images.avatar}
                  alt="Avatar"
                  style={{ width: 40, height: 40 }}
                />
              )}
              {store.auth ? (
                <p>
                  {store.auth.user.firstName + " " + store.auth.user.lastName}
                </p>
              ) : (
                <Button component={Link} to="/login" style={{ color: "#fff" }}>
                  {LOGIN}
                </Button>
              )}
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center p-2 w-75 hero-title">
            <h1 className="white-color">
              LA PLATEFORME AU SERVICE DE <br /> VOTRE ORGANISATION DE CHANTIER
              !
            </h1>
            <p className="w-75">
              Avec Orgaplan, la logistique de vos chantiers est facilitée :
              gardez une vision globale sur vos opérations, et permettez à vos
              entreprises de réserver leurs aires de stockage directement via la
              plateforme.
            </p>
            <button
              onClick={() => {
                window.scroll({
                  top: document.body.offsetHeight,
                  left: 0,
                  behavior: "smooth",
                });
              }}
              className="hero-btn"
            >
              En savoir plus
            </button>
          </div>
        </div>
        <div className="section-2">
          <h2>Votre Plan d’Installation de Chantier collaboratif !</h2>
          <div className="row justify-content-around">
            <div className=" col-3 text-center land-card">
              <img src={Images.landNote} alt="Creez Votre PIC" />
              <h5>Créez votre PIC</h5>
              <p>
                Chargez votre PIC et créez vos aires de livraison, moyens et
                aires de stockage
              </p>
            </div>
            <div className="col-3 text-center land-card">
              <img src={Images.landGroup} alt="Creez Votre PIC" />
              <h5>Ajoutez vos équipes</h5>
              <p>
                Que ce soit votre équipe, vos co-traitants ou vos
                sous-traitants, tous peuvent être ajoutés sur la plateforme
              </p>
            </div>
            <div className="col-3 text-center land-card">
              <img src={Images.landCalender} alt="Creez Votre PIC" />
              <h5>Réservez sur le PIC</h5>
              <p>
                Chaque aire de livraison, moyen et zone de stockage a son propre
                calendrier
              </p>
            </div>
          </div>
          <div className="section-3 mt-5">
            <h2>Inscrivez-vous dès maintenant !</h2>
            <p>
              Notre offre <b>Premium</b> vous permettra de :
            </p>
            <p>
              <img src={Images.checkbox} alt="checkbox Icon" />
              Créer un nombre illimité de projets
            </p>
            <p>
              <img src={Images.checkbox} alt="checkbox Icon" />
              Ajouter un nombre illimité de collaborateurs
            </p>
            <p>
              <img src={Images.checkbox} alt="checkbox Icon" />
              Avoir accès à toutes les fonctionnalités de gestion de vos
              chantiers
            </p>
            <p>
              <img src={Images.checkbox} alt="checkbox Icon" />
              Permettre la gestion des réservations, incidents, re-facturations,
              etc...
            </p>
            <CustomButton
              fullWidth={false}
              text="S’inscrire"
              onClick={() => setShowQuoteModal((st) => !st)}
            />
          </div>
          <div className="section-4">
            <h2>CONTACTEZ-NOUS </h2>
            <div className="row">
              <div className="col-6">
                <img src={Images.landPeople} alt="People Contacting Us" />
              </div>
              <div className="col-6">
                <form onSubmit={onSubmit}>
                  <FormInput
                    type="text"
                    name="company"
                    onChange={onChange}
                    value={company}
                    textAlign="left"
                    placeholder="Nom de l’entreprise"
                  />
                  <FormInput
                    type="text"
                    name="city"
                    value={city}
                    onChange={onChange}
                    textAlign="left"
                    placeholder="Ville"
                  />
                  <FormInput
                    type="text"
                    name="name"
                    value={name}
                    onChange={onChange}
                    textAlign="left"
                    placeholder="Prénom et Nom du contact"
                  />
                  <FormInput
                    type="number"
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    textAlign="left"
                    placeholder="Téléphone"
                  />
                  <FormInput
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    textAlign="left"
                    placeholder="Adresse e-mail"
                  />
                  <FormInput
                    textArea
                    width={"100"}
                    name="message"
                    value={message}
                    onChange={onChange}
                    textAlign="left"
                    placeholder="Message"
                  />
                  <CustomButton
                    type="submit"
                    fullWidth={false}
                    text={GLOBALS.I18n.t(SUBMIT)}
                    disabled={
                      !name || !message || !email || !phone || !city || !company
                    }
                  />
                </form>
              </div>
            </div>
          </div>
          <footer className="row p-3">
            <p className="col text-left">
              <b>Orgaplan</b> <br />
              La plateforme au service de votre organisation de chantier!
            </p>
            <Link
              className="col"
              style={{
                textDecoration: "none",
                color: "#656461",
                paddingTop: "15px",
              }}
              to="/privacy"
              className="col"
            >
              CGU
            </Link>
            <p className="col">CGV</p>
          </footer>
        </div>
      </div>
      <Modal
        maxWidth="sm"
        title="S'inscrire"
        open={showQuoteModal}
        onClose={() => {
          setShowQuoteModal(false);
          setQuoteMessage("");
        }}
        body={
          <Formik
            initialValues={{
              company: "",
              city: "",
              name: "",
              phone: "",
              email: "",
              contractType: "",
              message: "",
            }}
            onSubmit={onQuoteSubmit}
          >
            {({ errors, values, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} style={{ padding: "0 20px" }}>
                {quoteMessage && (
                  <div className="w-100 mx-auto my-2">
                    <div
                      className="login-input"
                      style={
                        quoteMessageType === "error"
                          ? {
                              backgroundColor: "#f44336",
                              borderColor: "1px solid #ffccc7",
                              color: "#fff",
                              textAlign: "center",
                            }
                          : {
                              backgroundColor: "#f6ffed",
                              borderColor: "1px solid #b7eb8f",
                              textAlign: "center",
                            }
                      }
                    >
                      {quoteMessage}
                    </div>
                  </div>
                )}
                <div className="w-100 mx-auto my-2">
                  <input
                    type="text"
                    name="company"
                    error={errors.company}
                    value={values.company}
                    onChange={handleChange}
                    className="login-input"
                    placeholder="Nom de l’entreprise"
                  />
                </div>
                <div className="w-100 mx-auto my-2">
                  <input
                    type="text"
                    name="city"
                    value={values.city}
                    placeholder="Ville"
                    onChange={handleChange}
                    className="login-input"
                  />
                </div>
                <div className="w-100 mx-auto my-2">
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className="login-input"
                    placeholder="Prénom et Nom du contact"
                  />
                </div>
                <div className="w-100 mx-auto my-2">
                  <input
                    type="number"
                    name="phone"
                    value={values.phone}
                    placeholder="Téléphone"
                    onChange={handleChange}
                    className="login-input"
                  />
                </div>
                <div className="w-100 mx-auto my-2">
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className="login-input"
                    placeholder="Adresse e-mail"
                  />
                </div>
                <div className="w-100 mx-auto my-2">
                  <input
                    textArea
                    width={"100"}
                    name="message"
                    value={values.message}
                    placeholder={MESSAGE}
                    onChange={handleChange}
                    className="login-input"
                  />
                </div>
                <div className="text-center mg-top-20">
                  <CustomButton
                    type="submit"
                    fullWidth={false}
                    loading={isSubmitting}
                    disabled={
                      isSubmitting ||
                      !values.email ||
                      !values.city ||
                      !values.name ||
                      !values.company ||
                      !values.phone
                    }
                    text={GLOBALS.I18n.t("submit")}
                  />
                </div>
              </form>
            )}
          </Formik>
        }
      />
    </>
  );
}
