import { useNavigate, useLoaderData } from "react-router-dom";
import { serverURL } from "../App";
import axios from "axios";
import { formatRowData } from "../utils/formatting";
import { nameDict } from "../utils/names";

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
  return !data.data ? (
    <>
      <div className="button ref-back-btn" onClick={buttonFunction}>
        Вернуться к таблице
      </div>
      <p>Не удалось найти данные об объекте</p>
    </>
  ) : (
    <>
      <div className="button ref-back-btn" onClick={buttonFunction}>
        Вернуться к таблице
      </div>
      <h1>{data.data.id_num}</h1>
      <p>
        {Object.entries(formattedData).map(([k, v]) => {
          return (
            <>
              {`${nameDict[k]}: ${v.label}`}
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
            Изменить
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
