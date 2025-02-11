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
  return data;
}

export default function MachineDetials({ params }) {
  const response = useLoaderData();
  const navigate = useNavigate();

  function buttonFunction(e) {
    navigate(-1);
  }
  const formattedData = formatRowData(response.data);
  console.log(formattedData);
  return !response.data ? (
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
      <h1>{response.data.id_num}</h1>
      <div>
        {Object.entries(formattedData).map(([k, v]) => {
          return <div key={"row-" + k}>{nameDict[k] + ": " + v.label}</div>;
        })}
      </div>
    </>
  );
}
