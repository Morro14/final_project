import { Link } from "react-router-dom";

export default function AddFormIndex(params) {
  const buttonNames = ["Техника", "Тех. обслуживание", "Рекламация"];
  const links = ["machine", "maintenance", "reclamation"];

  return (
    <div className="add-form-index">
      <h2>Добавить данные:</h2>
      <div className="add-form-index-buttons">
        <Link
          className="button add-form-index-button"
          to={"/dashboard/create/" + links[0]}
        >
          {buttonNames[0]}
        </Link>
        <Link
          className="button add-form-index-button"
          to={"/dashboard/create/" + links[1]}
        >
          {buttonNames[1]}
        </Link>
        <Link
          className="button add-form-index-button"
          to={"/dashboard/create/" + links[2]}
        >
          {buttonNames[2]}
        </Link>
      </div>
    </div>
  );
}
