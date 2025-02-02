import "../../styles/Authorization.css";
import "../../styles/Buttons.css";

import { useState } from "react";
import { useAuth } from "./AuthProvider.js";

export default function Authorization(params) {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const auth = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.email !== "" && input.password !== "") {
      auth.loginAction(input);
    } else {
      alert("Пожалуйста, введите верные данные");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let authErrorMsg = "";
  if (auth.loading) {
    authErrorMsg = "loading..."
  } else if (auth.exception === "401") {
    authErrorMsg = "Неверные данные";
  } else if (auth.exception === "server error") {
    authErrorMsg = "Не удалось авторизироваться";
  }

  return (
    <div className="auth">
      <div className="auth-content">
        <h2 className="auth-title">Авторизация</h2>
        <div className="auth-excpetion-msg">{authErrorMsg}</div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email_input">
            <span>E-mail</span>
          </label>
          <input
            id="email_input"
            name="email"
            className="search-bar auth-email-input"
            onChange={handleChange}
          ></input>
          <label htmlFor="pwd_input">Пароль</label>
          <input
            type="password"
            name="password"
            id="pwd_input"
            className="search-bar auth-pwd-input"
            onChange={handleChange}
          ></input>
          <button type="submit" className="button auth-button">
            <div className="button-text">Войти</div>
          </button>
        </form>
      </div>
    </div>
  );
}
