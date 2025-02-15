import { Link, useOutletContext } from "react-router-dom";

export default function AddFormIndex({ children }) {
  const buttonNames = [
    "Техника",
    "Тех. обслуживание",
    "Рекламация",
    "Справочник",
  ];
  const links = ["machine", "maintenance", "reclamation", "reference"];
  const { user } = useOutletContext().user;

  let addReferenceButton = "";
  let addMachineButton = "";
  let addReclamationButton = "";
  const userManager = user.groups.find((g) => g.name === "Manager");
  if (userManager) {
    addReferenceButton = (
      <Link
        className="button add-form-index-button"
        to={"/dashboard/create/" + links[3]}
      >
        {buttonNames[3]}
      </Link>
    );
    addMachineButton = (
      <Link
        className="button add-form-index-button"
        to={"/dashboard/create/" + links[0]}
      >
        {buttonNames[0]}
      </Link>
    );
  }
  if (
    userManager ||
    user.user_type === "service" ||
    user.user_type === "service_company"
  ) {
    addReclamationButton = (
      <Link
        className="button add-form-index-button"
        to={"/dashboard/create/" + links[2]}
      >
        {buttonNames[2]}
      </Link>
    );
  }
  return (
    <div className="add-form-index">
      <h2>Добавить данные:</h2>
      <div className="add-form-index-buttons">
        {addMachineButton}
        <Link
          className="button add-form-index-button"
          to={"/dashboard/create/" + links[1]}
        >
          {buttonNames[1]}
        </Link>
        {addReclamationButton}
        {addReferenceButton}
      </div>
    </div>
  );
}
