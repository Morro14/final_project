import "../styles/Header.css";
import "../styles/Buttons.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../media/Logotype_accent.png";
import telegram_logo from "../media/telegram_logo.png";
import { useAuth } from "./AuthProvider";

export default function Header({ params }) {
  const [displayValue, setDisplayValue] = useState("");
  const auth = useAuth();
  let loginButtonText = "";

  // let profileIcon = (
  //   <div className="profile_icon" style={`display: ${displayValue}`}></div>
  // );
  const navigate = useNavigate();

  const handleClick = (e) => {
    return navigate("/auth");
  };

  let buttonFucntion = handleClick;

  if (auth.token) {
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
        <a className="header__logo">
          <img src={logo}></img>
        </a>
        {/* <div className="header-container-middle"> */}
        <div className="header__title">
          <div className="title-line-1">Мой Силант</div>
          <div className="title-line-2">Электронная сервисная книжка</div>
        </div>

        <div className="top-bar">
          <div className="top-bar__link">
            {/* <img className="telegram-logo" src={telegram_logo}></img> */}
            <div className="telegram-num">Telegram: +7-8352-20-12-09</div>
          </div>
          <Link to="/dashboard/machines">
            <div className={`profile_icon ${displayValue}`}>
              <div className="tooltip">Профиль</div>
              <div className="P">П</div>
            </div>
          </Link>
          <div className="button login-button" onClick={buttonFucntion}>
            <div className="button-text login-button-text">
              {loginButtonText}
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
