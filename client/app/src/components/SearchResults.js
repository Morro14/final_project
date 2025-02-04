import axios from "axios";
import { serverURL } from "../App.js";
import "../styles/SearchResults.css";
import "../styles/Tooltip.css";
import { useLoaderData } from "react-router-dom";
import ErrorComp from "./Errors/ErrorComp.js";
import { linkNames, nameDict } from "../utils/names.js";
import { formatRowData, getLink } from "../utils/formatting.js";

export async function detailsLoader({ params }) {
  let data = null;
  await axios
    .get(`${serverURL}/machines/${params.id}`)
    .then((r) => {
      data = r;

    })
    .catch((e) => {
      if (e.status !== 401) {
        throw new Response("Not Found", { status: 404, statusText: e.response.statusText })
      }
    });

  if (!data) {
    console.log("sending restricted request");
    await axios
      .get(`${serverURL}/machines/restricted/${params.id}`)
      .then((r) => {
        data = r;
      })
      .catch((e) => {
        if (e.status !== 200) {
          throw new Response("Not Found", { status: 404, statusText: e.response.statusText })
        }
      });
  }

  return data;
}

export default function SearchResults() {

  const fieldLabel = (name_prev) => {
    return nameDict[name_prev];
  };

  const response = useLoaderData();


  const formattedData = formatRowData(response.data)
  return (
    <>
      <h2>Результаты поиска:</h2>
      <p className="machine-title">Машина {response.data.id_num}</p>

      <div className="results-table-container">
        <table className="results-table table">
          <thead></thead>
          <tbody>
            {Object.entries(formattedData).map(([key, value]) => (
              <tr key={"rlst_tr" + key}>
                <th key={"rslt_th_" + key}>{fieldLabel(key)}</th>
                <td key={"rlst_td" + key}>
                  {getLink(key, value, linkNames)}

                  <div className={`tooltip tooltip-${key}`} key={key}>
                    {value}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
