import {
  useNavigate,
  useParams,
  Form,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import { sortLabels } from "../details/names";
import TableSorted from "./TableSorted";
import axios from "axios";
import { serverURL } from "../App";
import { NavLink } from "react-router-dom";

export async function sortedLoader({ params, request }) {
  // console.log("table loader", params);
  let sorting = new URL(request.url).searchParams.get("sorting");
  if (sorting === null) {
    switch (params.value) {
      case "machines":
        sorting = "shipment_date";
        break;
      case "maintenances":
        sorting = "mt_date";
        break;
      case "reclamations":
        sorting = "refuse_date";
        break;
    }
  }

  const data = await axios
    .get(serverURL + `/dashboard/tab=${params.value}&sorting=${sorting}`)
    .then((r) => {
      return r;
    })
    .catch((e) => {
      return e;
    });
  return data;
}

export default function TableNav({ params }) {
  const navigate = useNavigate();
  const tabActive = useParams().value;
  const client = useOutletContext().client;
  const data = useLoaderData();

  const sortedList = data.data.sorted_list;

  const getTableTitle = (tabActive) => {
    const names = {
      machines: "Техника",
      maintenances: "Тех. обслуживания",
      reclamations: "Рекламации",
    };
    if (names[tabActive]) {
      return names[tabActive];
    }
  };
  const sortNames = (tabActive) => {
    return sortLabels[tabActive];
  };

  const sortedNames = sortNames(tabActive);

  const onSelectAction = (e) => {
    const value = e.target.value;
    e.preventDefault();
    navigate(`/dashboard/${tabActive}?sorting=${value}`);
  };

  return sortedList.length === 0 ? (
    <div className="table-error-msg">Данных не найдено</div>
  ) : (
    <div className="table-container-main">
      <h1 className="dashboard-title">{client.name}</h1>
      <h4 className="dashboard-info">
        Информация о комплектации и характеристиках вашей техники
      </h4>
      <div className="tab-bar">
        <NavLink className="button tab-button" to={"/dashboard/machines"}>
          Техника
        </NavLink>
        <NavLink className="button tab-button" to={"/dashboard/maintenances"}>
          Т.О.
        </NavLink>
        <NavLink className="button tab-button" to={"/dashboard/reclamations"}>
          Рекламации
        </NavLink>
      </div>
      <div className="dashboard-topbar">
        <h3 className="dashboard-table-title">{getTableTitle(tabActive)}</h3>

        <Form className="sort-form">
          <label>соритровать по: </label>

          <select className="filter-select" onChange={onSelectAction}>
            {sortedNames.map((i) => (
              <option value={i.value} key={`sl-op-${tabActive}-${i.value}`}>
                {i.label}
              </option>
            ))}
          </select>
        </Form>
      </div>
      <TableSorted params={{ tab: tabActive, list: sortedList }}></TableSorted>
    </div>
  );
}
