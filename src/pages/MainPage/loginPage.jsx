import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Images } from "../../assets/Assets";
import Input from "../../components/Input";
import Button from "../../components/Button";
import "./loginPage.css";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showModal: false,
      input: {},
    };
  }

  validate = () => {};

  handleShow() {
    const show = !this.state.show;
    this.setState({ show });
  }
  handleModal() {
    const showModal = !this.state.showModal;
    this.setState({ showModal });
  }

  buttonStyle = {
    fontSize: "14px",
    width: "auto",
    fontWeight: "bold",
    marginTop: "2rem",
    textAlgin: "center",
    padding: "8px 20px",
    marginBottom: "1rem",
    backgroundColor: "#DBB208",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
  };
  render() {
    return (
      <>
        <div className="login-container">
          <div className=" left-login-container">
            <img src={Images.logo} alt="OrgaPlan" />
          </div>
          <div className="right-login-container">
            <h1>PAGE DE CONNEXION</h1>

            <div className="w-75">
              <input
                type="email"
                name="email"
                value={this.state.input.email}
                required
                placeholder="Adresse e-mail"
                className="login-input"
              />

              <input
                name="password"
                type="password"
                value={this.state.input.password}
                required
                placeholder="Mot de passe"
                className="login-input"
              />
            </div>
            <div className="text-center">
              <button onClick={this.handleSubmit} style={this.buttonStyle}>
                SE CONNECTER
              </button>
            </div>
            <span
              style={{ cursor: "pointer", color: "#8B8989" }}
              onClick={() => {
                this.handleShow();
              }}
            >
              Mot de passe oublié ?
            </span>
          </div>
        </div>
        <Modal animation="false" centered show={this.state.show}>
          <Modal.Body className="modal-container">
            <h3>MOT DE PASSE OUBLIÉ ?</h3>
            <span
              onClick={() => {
                this.handleShow();
              }}
              className="modalClose"
            >
              X
            </span>
            <p>
              Informez votre adresse e-mail afin de réinitialiser votre mot de
              passe :
            </p>
            <div className="w-75 m-auto">
              <input
                type="email"
                placeholder="Adresse e-mail"
                className="login-input"
              />
            </div>
            <div className="text-center">
              <Button
                onClick={() => {
                  this.handleModal();
                }}
                style={this.buttonStyle}
              >
                ENVOYER
              </Button>
            </div>
          </Modal.Body>
        </Modal>
        <Modal animation="false" centered show={this.state.showModal}>
          <Modal.Body className="modal-container">
            <h3>RÉINITIALISATION DU MOT DE PASSE : </h3>
            <span
              onClick={() => {
                this.handleModal();
              }}
              className="modalClose"
            >
              X
            </span>
            <p>
              Entrez les informations suivantes pour réinitialiser votre mot de
              passe :
            </p>
            <div className="w-75 mx-auto my-2">
              <input
                type="email"
                placeholder="Adresse e-mail"
                style={{ border: "1px solid #d7d7d7" }}
                className="login-input"
              />
            </div>
            <div className="w-75 mx-auto my-3">
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                style={{ border: "1px solid #d7d7d7" }}
                className="login-input"
              />
            </div>
            <div className="w-75 mx-auto mt-2">
              <input
                type="password"
                placeholder="Confirmation du nouveau mot de passe"
                style={{ border: "1px solid #d7d7d7" }}
                className="login-input"
              />
            </div>
            <div className="text-center">
              <Button
                onClick={() => {
                  this.handleModal();
                }}
                style={this.buttonStyle}
              >
                ENVOYER
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default LoginPage;
