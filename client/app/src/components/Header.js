import "../styles/Header.css";
import "../styles/Buttons.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../media/Logotype_accent.png";
import telegram_logo from "../media/telegram_logo.png";
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
  let logoLink = '/'
  if (auth.token) {
    logoLink = '/dashboard'
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
        <Link to={logoLink}>
          <div className="header-logo">
            <img src={logo}></img>
          </div>
        </Link>
        <div className="header-title">
          <div className="title-line-1">Мой Силант</div>
          <div className="title-line-2">Электронная сервисная книжка</div>
        </div>

        <div className="top-bar">

          <div className="top-bar-telegram">
            Telegram: +7-8352-20-12-09
          </div>

          <Link to="/">
            <button className={`button header-button`}>
              Поиск техники
            </button>
          </Link>
          <Link to="/dashboard/machines">
            <button className={`header-profile-container profile-button button header-button ${displayValue}`}>
              <div className="header-user-email">{"Мои данные: " + auth.email}</div>
            </button>
          </Link>

          <button className="login-button button header-button" onClick={buttonFucntion}>
            <div className="button-text login-button-text">
              {loginButtonText}
            </div>
          </button>

        </div>

      </div >
    </div >
  );
}
