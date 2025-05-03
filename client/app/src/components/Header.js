import "../styles/Header.css";
import "../styles/Main.css";
import "../styles/Buttons.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../media/Logotype_accent.png";
import { useAuth } from "./Auth/AuthProvider";

export default function Header({ params }) {
  const auth = useAuth();
  const t = auth.translate


  const navigate = useNavigate();

  const handleClick = (e) => {
    return navigate("/auth");
  };

  let buttonFucntion = handleClick;
  let logoLink = "/";

  if (auth.token) {
    logoLink = "/dashboard";

    buttonFucntion = (e) => {
      auth.logoutAction();
    };

  }

  return (
    <div className="header">
      <div className="container header-container-middle">
        <div className="logo-name-container">
          <div className="logo-and-telegram">
            <Link to={logoLink}>
              <div className="header-logo">
                <img src={logo}></img>
              </div>
            </Link>
            <div className="top-bar-telegram">telegram: +7-8352-20-12-09</div>
          </div>
        </div>

        <div className="header-title">
          <div className="title-line-1">
            {t('title')}
          </div>
          <div className="top-bar">
            <div className="tob-bar-button-1">
              <Link to="/">
                <button className={`button header-button`}>
                  {t('machineSearch')}
                </button>
              </Link>
            </div>
            <div className="top-bar-button-2">
              <Link to="/dashboard/machines">
                <button
                  className={`header-profile-container profile-button button header-button`}
                >
                  <div className="header-user-email">
                    {auth.token === '' ? '' : t('myData') + ': ' + auth.email}
                  </div>
                </button>
              </Link>
            </div>
            <div className="top-bar-button-3">

              <button
                className="login-button button header-button"
                onClick={buttonFucntion}
              >
                <div className="button-text login-button-text">
                  {auth.token !== '' ? t('logout') : t('login')}
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
