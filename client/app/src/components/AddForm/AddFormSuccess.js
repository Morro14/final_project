import { useNavigate } from "react-router-dom";
import { nameDict } from "../../utils/names";
import { useAuth } from '../Auth/AuthProvider'
export const AddFormSuccess = () => {
  const navigate = useNavigate();
  function buttonFunction(e) {
    navigate("/dashboard");
  }
  const data = localStorage.getItem("formData");

  const dataParsed = JSON.parse(data);

  const formData = dataParsed.data;
  const category = dataParsed.category;
  const auth = useAuth()
  const t = auth.translate
  return (
    <>
      <button className="button" onClick={buttonFunction}>
        {t('return')}
      </button>
      <h1>{t('submitSuccess')}</h1>
      <h4>
        {nameDict[category].charAt(0).toUpperCase() +
          nameDict[category].slice(1)}
      </h4>
      <div>
        {Object.entries(formData).map(([k, v]) => (
          <div key={k + "add-frm-scs-key"}>{`${t(nameDict[k])}: ${nameDict[v] ? t(nameDict[v]) : v
            }`}</div>
        ))}
      </div>
    </>
  );
};
