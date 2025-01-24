import { Outlet } from "react-router-dom";
import "../styles/Buttons.css";
import "../styles/Main.css";
import "../styles/Search.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Search({ params }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    return navigate(`search/${value}`);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setResult("");
  };

  return (
    <>
      <h1>
        Проверьте комплектацию и технические характеристики техники Силант
      </h1>
      <div className="id-search-container">
        <p>Заводской номер: </p>
        <form className="main-form" onSubmit={handleSubmit}>
          <div className="search-bar-container">
            <input
              value={value}
              onInput={handleChange}
              className="search-bar"
              required
            ></input>
          </div>
          <button type="submit" className="button search-button">
            <div className="button-text">Поиск</div>
          </button>
        </form>
      </div>
      <Outlet></Outlet>
    </>
  );
}
