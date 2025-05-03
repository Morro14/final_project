import { useNavigate, useLoaderData } from "react-router-dom";
import { serverURL } from "../App";
import axios from "axios";
import { formatRowData } from "../utils/formatting";
import { nameDict } from "../utils/names";
import { useAuth } from "./Auth/AuthProvider";

export async function machineLoader({ params }) {
  const data = await axios

    .get(`${serverURL}/machines/${params.value}`)
    .then((r) => {
      return r;
    })
    .catch((r) => {
      if (r.status !== 200) {
        throw new Response("Not Found", {
          status: 404,
          statusText: r.response.statusText,
        });
      }
    });
  const userData = await axios

    .get(`${serverURL}/dashboard`)
    .then((r) => {
      return r;
    })
    .catch((r) => {
      return "nonAuth";
    });
  return [data, userData];
}

export default function MachineDetials({ params }) {
  const [data, userData] = useLoaderData();
  const navigate = useNavigate();

  function buttonFunction(e) {
    navigate(-1);
  }
  function buttonChangeFunction() {
    navigate("/dashboard/edit/machine/" + data.data.id_num);
  }
  const accessCheck =
    userData === "nonAuth" ? false : userData.data.user.user_type === "manager";
  const formattedData = formatRowData(data.data);
  const auth = useAuth()
  const t = auth.translate
  return !data.data ? (
    <>
      <div className="button ref-back-btn" onClick={buttonFunction}>
        {t('return')}
      </div>
      <p>{t('detailsNotFound')}</p>
    </>
  ) : (
    <>
      <div className="button ref-back-btn" onClick={buttonFunction}>
        {t('return')}
      </div>
      <h1>{'Machine ID ' + data.data.id_num}</h1>
      <p>
        {Object.entries(formattedData).map(([k, v]) => {
          return (
            <>
              {`${t(nameDict[k])}: ${v.label}`}
              <br />
            </>
          );
        })}
      </p>
      <div>
        {accessCheck ? (
          <div
            className="button machine-change-btn"
            onClick={buttonChangeFunction}
          >
            {t('edit')}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
