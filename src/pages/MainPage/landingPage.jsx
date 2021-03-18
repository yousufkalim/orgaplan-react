import React, { Component } from "react";
import { Images } from "../../assets/Assets";
import "./landingPage.css";
class LandingPage extends Component {
  render() {
    return (
      <div className="land-container">
        <div className="hero">
          <div
            className="d-flex justify-content-between p-1 
          "
          >
            <nav className="d-flex justify-content-between align-self-start pt-3 w-50">
              <a href="https://www.google.com">
                <img src={Images.logo} className="hero-logo" alt="logo" />
              </a>
              <a href="https://www.google.com" className="text-white">
                Fonctionnalites
              </a>
              <a href="https://www.google.com" className="text-white">
                S'inscrire
              </a>
              <a href="https://www.google.com" className="text-white">
                Nous contacter
              </a>
            </nav>
            <div className="text-center text-black-50">
              <img
                src={Images.avatar}
                alt="Avatar"
                style={{ width: 40, height: 40 }}
              />
              <p>Thiery Martin</p>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center p-2 w-75 hero-title">
            <h1>
              LA PLATEFORME AU SERVICE DE VOTRE ORGANISATION DE CHANTIER !
            </h1>
            <p className="w-75">
              Avec Orgaplan, la logistique de vos chantiers est facilitée :
              gardez une vision globale sur vos opérations, et permettez à vos
              entreprises de réserver leurs aires de stockage directement via la
              plateforme.
            </p>
            <button className="hero-btn">En savoir plus</button>
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
                sous-traitants, tous peuvent être ajoutés à la plateforme
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
              Créer un nombre illimité de projet
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
              Permettre la gestion des réservations, incidents, refacturation,
              etc…
            </p>
            <button>S’inscrire</button>
          </div>
          <div className="section-4">
            <h2>CONTACTEZ-NOUS </h2>
            <div className="row">
              <div className="col-6">
                <img src={Images.landPeople} alt="People Contacting Us" />
              </div>
              <div className="col-6">
                <form>
                  <input type="text" placeholder="Nom de l’entreprise" />
                  <input type="text" placeholder="Ville" />
                  <input type="text" placeholder="Prénom et Nom du contact" />
                  <input type="text" placeholder="Téléphone" />
                  <input type="text" placeholder="Adresse e-mail" />
                  <textarea
                    name="comment"
                    placeholder="Message"
                    cols="30"
                    rows="10"
                  ></textarea>
                  <button>Envoyer</button>
                </form>
              </div>
            </div>
          </div>
          <footer className="row p-3">
            <p className="col text-left">
              <b>Orgaplan</b> <br />
              La platefore au servic e de votre organisation de chantier !
            </p>
            <p className="col">CGU</p>
            <p className="col">CGV</p>
          </footer>
        </div>
      </div>
    );
  }
}

export default LandingPage;
