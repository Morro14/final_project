import axios from "axios";
import { serverURL } from "../App.js";
import "../styles/SearchResults.css";
import "../styles/Tooltip.css";
import { useLoaderData } from "react-router-dom";
import ErrorComp from "./ErrorComp.js";
import { Link } from "react-router-dom";

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
  const nameDict = {
    engine_id: "Зав.№ двигателя",
    engine_model: "Модель двигателя",
    id_num: "Заводской номер машины",
    main_bridge_id: "Зав.№ главного моста",
    main_bridge_model: "Модель главного моста",
    model: "Модель",
    steerable_bridge_id: "Зав.№ двигателя",
    steerable_bridge_model: "Модель двигателя",
    transmission_id: "Зав.№ трансмиссии",
    transmission_model: "Модель трансмиссии",
    supply_contract_num_date: "Договор поставки №, дата",
    shipment_date: "Дата отгрузки с завода",
    cargo_receiver: "Грузополучатель (конечный потребитель)",
    supply_address: "Адрес поставки (эксплуатации)",
    equipment_add: "Комплектация",
    client: "Клиент",
    service_company: "Сервисная компания",
  };
  const keyNames = (name_prev) => {
    return nameDict[name_prev];
  };

  const response = useLoaderData();
  console.log("rendering results: repsonse", response);

  // let dataNew = response.data;
  const { id, sorting_fields, ...rest } = response.data;
  const dataNew = rest;
  const getLink = (key, value) => {
    const keysArray = [
      "model",
      "engine_model",
      "main_bridge_model",
      "steerable_bridge_model",
      "transmission_model",
    ];

    const found = keysArray.find((k) => key === k);
    if (found) {
      return <Link to={`/details/${value}`}>{value}</Link>;
    } else return value;
  };

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
            {Object.entries(dataNew).map(([key, value]) => (
              <tr key={"rlst_tr" + key}>
                <th key={"rslt_th_" + key}>{keyNames(key)}</th>
                <td key={"rlst_td" + key}>
                  {getLink(key, value)}

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
