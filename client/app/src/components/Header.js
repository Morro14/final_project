import "../styles/Header.css";
import "../styles/Main.css";
import "../styles/Buttons.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../media/Logotype_accent.png";
import { useAuth } from "./Auth/AuthProvider";

export default function Header({ params }) {
  const [displayValue, setDisplayValue] = useState("");
  const auth = useAuth();
  let loginButtonText = "";

  const navigate = useNavigate();

  const handleClick = (e) => {
    return navigate("/auth");
  };

  let buttonFucntion = handleClick;
  let logoLink = "/";
  if (auth.token) {
    logoLink = "/dashboard";
    loginButtonText = "Выйти";
    if (displayValue !== "shown") {
      setDisplayValue("shown");
    }

    buttonFucntion = (e) => {
      auth.logoutAction();
    };
  } else {
    if (displayValue !== "hidden") {
      setDisplayValue("hidden");
    }

    loginButtonText = "Авторизация";
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
            Электронная сервисная книжка "Мой Силант"
          </div>
          <div className="top-bar">
            <div className="tob-bar-button-1">
              {/* <div className="arrow-header">{">"}</div> */}
              <Link to="/">
                <button className={`button header-button`}>
                  Поиск техники
                </button>
              </Link>
            </div>
            <div className="top-bar-button-2">
              {/* <div className="arrow-header">{">"}</div> */}
              <Link to="/dashboard/machines">
                <button
                  className={`header-profile-container profile-button button header-button ${displayValue}`}
                >
                  <div className="header-user-email">
                    {"Мои данные: " + auth.email}
                  </div>
                </button>
              </Link>
            </div>
            <div className="top-bar-button-3">
              {/* <div className="arrow-header">{">"}</div> */}
              <button
                className="login-button button header-button"
                onClick={buttonFucntion}
              >
                <div className="button-text login-button-text">
                  {loginButtonText}
                </div>
              </button>
            </div>
          </div>
          {/* <div className="title-line-2">Электронная сервисная книжка</div> */}
        </div>
      </div>
    </div>
  );
}
