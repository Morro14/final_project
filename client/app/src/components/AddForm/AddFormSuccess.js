import { useNavigate } from "react-router-dom";
import { nameDict } from "../../utils/names";

export const AddFormSuccess = () => {
  const navigate = useNavigate();
  function buttonFunction(e) {
    navigate("/dashboard");
  }
  // const { formData, category } = useAddFormCon()
  const data = localStorage.getItem("formData");

  const dataParsed = JSON.parse(data);

  const formData = dataParsed.data;
  const category = dataParsed.category;
  return (
    <>
      <button className="button" onClick={buttonFunction}>
        Вернуться
      </button>
      <h1>Данные успешно добавлены</h1>
      <h4>
        {nameDict[category].charAt(0).toUpperCase() +
          nameDict[category].slice(1)}
      </h4>
      <div>
        {Object.entries(formData).map(([k, v]) => (
          <div key={k + "add-frm-scs-key"}>{`${nameDict[k]}: ${v}`}</div>
        ))}
      </div>
    </>
  );
};
