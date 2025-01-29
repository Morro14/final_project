import axios from "axios";
import { serverURL } from "../App.js";
import "../styles/SearchResults.css";
import "../styles/Tooltip.css";
import { useLoaderData } from "react-router-dom";
import ErrorComp from "./ErrorComp.js";
import { Link } from "react-router-dom";
import { linkNames, nameDict } from "../utils/names.js";
import { formatRowData, getLink } from "../utils/formatting.js";

export async function detailsLoader({ params }) {
  let data = null;
  await axios
    .get(`${serverURL}/machines/${params.id}`)
    .then((r) => {
      data = r;
      console.log("getting /machines response", r);
    })
    .catch((e) => {
      if (e.response.status !== 401) {
        data = e;
      }
    });
  console.log("data", data);
  if (!data) {
    console.log("sending restricted request");
    await axios
      .get(`${serverURL}/machines/restricted/${params.id}`)
      .then((r) => {
        data = r;
      })
      .catch((e) => {
        console.log("Error", e.response.status);

        data = e;
      });
  }

  return data;
}

export default function SearchResults() {

  const fieldLabel = (name_prev) => {
    return nameDict[name_prev];
  };

  const response = useLoaderData();

  const { id, sorting_fields, ...rest } = response.data;
  const dataNew = rest;
  const formattedData = formatRowData(response.data)

  return !response.data ? (
    <ErrorComp response={response}></ErrorComp>
  ) : (
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

            {/* <tr>
              {Object.entries(dataNew).map(([key, value]) => (
                <td key={key}>
                  {getLink(key, value)}

                  <div className={`tooltip tooltip-${key}`} key={key}>
                    {value}
                  </div>
                </td>
              ))}
            </tr> */}
          </tbody>

          {/* <thead>
            <tr>
              {Object.entries(dataNew)
                .slice(8, 17)
                .map(([key, value]) => (
                  <th key={key}>{keyNames(key)}</th>
                ))}
            </tr>
            <tr>
              {Object.entries(dataNew)
                .slice(8, 17)
                .map(([key, value]) => (
                  <td key={key}>
                    {getLink(key, value)}

                    <div className={`tooltip tooltip-${key}`} key={key}>
                      {value}
                    </div>
                  </td>
                ))}
            </tr>
          </thead> */}
        </table>
      </div>
    </>
  );
}
