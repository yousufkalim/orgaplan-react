import React from "react";
import { Images } from "../../assets/Assets";
import Card from "../../components/Card";
import "./WelcomeScreen.css";
const WelcomeScreen = (props) => {
  const cardClasses = {
    cardHeader: "bold-text text-center mb-3",
    cardPara: "bold-text text-center mt-3 mb-0",
  };
  return (
    <div className="card-wrapper row ">
      <div className="leftCard w-75">
        <div className="d-flex justify-content-between bg-white p-3 ">
          <img src={Images.logo} alt="OrgaPlan Logo" />
          <p>Aller à la page d’accueil</p>
        </div>
        <div className=" bg-white">
          <h2 className="bold-text">BIENVENUE SUR ORGAPLAN ! </h2>
          <div>
            Cliquez sur un projet existant ou bien créez un nouveau projet :{" "}
          </div>
        </div>
        <div className="row p-5 bg-white main-card">
          <div
            className="row"
            style={{
              backgroundColor: "#f8f8f8",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <div className="col-4 mt-1">
              <div>
                <Card>
                  <h6 className={cardClasses.cardHeader}>Project Louviere</h6>
                  <img src={Images.site1} alt="Site 1" />
                  <p className={cardClasses.cardPara}>Rôle : Admin </p>
                </Card>
              </div>
            </div>

            <div className="col-4 mt-1">
              <div>
                <Card>
                  <h6 className={cardClasses.cardHeader}>Project Louviere</h6>
                  <img src={Images.site2} alt="Site 2" />
                  <p className={cardClasses.cardPara}>Rôle : Admin </p>
                </Card>
              </div>
            </div>
            <div className="col-4 mt-1">
              <div>
                <Card>
                  <h6 className={cardClasses.cardHeader}>Project Louviere</h6>
                  <img src={Images.site3} alt="Site 3" />
                  <p className={cardClasses.cardPara}>Rôle : Admin </p>
                </Card>
              </div>
            </div>
            <div className="col-4 mt-1">
              <div>
                <Card>
                  <h6 className={cardClasses.cardHeader}>Project Louviere</h6>
                  <img src={Images.site3} alt="Site 3" />
                  <p className={cardClasses.cardPara}>Rôle : Admin </p>
                </Card>
              </div>
            </div>
            <div className="col-4 mt-1">
              <div>
                <Card>
                  <h6 className={cardClasses.cardHeader}>Project Louviere</h6>
                  <img src={Images.site3} alt="Site 3" />
                  <p className={cardClasses.cardPara}>Rôle : Admin </p>
                </Card>
              </div>
            </div>
            <div className="col-4 mt-1">
              <div>
                <Card>
                  <h6 className={cardClasses.cardHeader}>Project Louviere</h6>
                  <img src={Images.site3} alt="Site 3" />
                  <p className={cardClasses.cardPara}>Rôle : Admin </p>
                </Card>
              </div>
            </div>
            <div className="col-4 mt-1">
              <div>
                <Card>
                  <h6 className={cardClasses.cardHeader}>Project Louviere</h6>
                  <img src={Images.site3} alt="Site 3" />
                  <p className={cardClasses.cardPara}>Rôle : Admin </p>
                </Card>
              </div>
            </div>
            <div className="col-4 mt-1">
              <div>
                <Card>
                  <h6 className={cardClasses.cardHeader}>Project Louviere</h6>
                  <img src={Images.site3} alt="Site 3" />
                  <p className={cardClasses.cardPara}>Rôle : Admin </p>
                </Card>
              </div>
            </div>
            <div className="col-4 mt-1">
              <div>
                <Card>
                  <h6 className={cardClasses.cardHeader}>Project Louviere</h6>
                  <img src={Images.site3} alt="Site 3" />
                  <p className={cardClasses.cardPara}>Rôle : Admin </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rightCard col-3">
        <div className="main-card">
          <div>
            <Card className="rightCard">
              <span className="pencilButton">
                <img src={Images.pencil} alt="pencil Icon" />
              </span>
              <div className="text-center">
                <img src={Images.avatar} className="w-25" alt="Images" />
                <span className="m-4 d-block">Thierry Marles</span>
              </div>
              <p>ADRESSE E-MAIL : </p>
              <p>Thierry.marles@constructbtp.com</p>
              <p>TELEPHONE : </p>
              <p>06.94.01.10.41</p>
              <p>ENTREPRISE : </p>
              <p>
                CONSTRUCT BTP 23, rue de la Provenance, Villetaneuse - 67423
              </p>
              <button>MODIFIER MON MOT DE PASSE</button>
              <button>ME DECONNECTER</button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
