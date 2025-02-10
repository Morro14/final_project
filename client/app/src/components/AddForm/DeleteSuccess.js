import { useNavigate } from "react-router-dom";

export const DeleteSuccess = ({ params }) => {
  const navigate = useNavigate();
  function buttonFunction(e) {
    navigate("/dashboard");
  }

  return (
    <>
      <button className="button" onClick={buttonFunction}>
        Вернуться
      </button>
      <h1>Данные успешно удалены</h1>
      <h4>{category}</h4>
      <div>
        {Object.entries(formData).map(([k, v]) => (
          <div key={k + "add-frm-scs-key"}>{`${k}: ${v}`}</div>
        ))}
      </div>
    </>
  );
};
