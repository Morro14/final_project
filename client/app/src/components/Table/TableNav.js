import {
  useNavigate,
  useParams,
  Form,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { filterFields, nameDict, sortLabels } from "../../utils/names";
import TableSorted from "./TableSorted";
import axios from "axios";
import { serverURL } from "../../App";
import { NavLink } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Select } from "../AddForm/form_components/Select";
import { formatHeaders } from "../../utils/formatting";
import { useState } from "react";
import TableFilter from "./TableFilter";
import TableSort from "./TableSort";


export async function sortedLoader({ params, request }) {
  // console.log("table loader", params);
  let sorting = new URL(request.url).searchParams.get("sorting");
  let filter = new URL(request.url).searchParams.get("filter");


  // default sorting
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

  const filterURL = filter ? `&filter=${filter}` : ""
  const sortingURL = sorting ? `?sorting=${sorting}` : ""
  const requestURL = serverURL + `/dashboard/${params.value}${sortingURL}${filterURL}`
  console.log(requestURL)

  const data = await axios
    .get(requestURL)
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
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(data)
  console.log('searchParams', searchParams.get("filter"))

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
  const formattedData = formatHeaders(sortedList[0])
  // TODO no sorted list exception
  const sortNames = Object.keys(formattedData);
  const sortOptions = sortNames.map((n) => ({ "name": nameDict[n], "id": n }))

  const filterNames = filterFields[tabActive]
  const filterOptions = filterNames.map((n) => ({ "name": nameDict[n], "id": n }))


  const [tableParams, setTableParams] = useState({ filter: searchParams.get("filter") || "", sorting: searchParams.get("sorting") || "" })

  const handleFilterSelect = (e) => {
    e.preventDefault();
    setTableParams({ ...{ filter: e.target.value, sorting: searchParams.get("sorting") } })
    const sorting = tableParams.sorting === "" ? "" : `&sorting=${tableParams.sorting}`
    navigate(`/dashboard/${tabActive}?filter=${e.target.value}${sorting}`);
  };

  const handleSortingSelect = (e) => {
    e.preventDefault();
    setTableParams({ ...{ sorting: e.target.value } })
    const filter = tableParams.filter === "" ? "" : `filter=${tableParams.filter}`
    navigate(`/dashboard/${tabActive}?${filter}&sorting=${e.target.value}`);
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
        <div className="tab-bar-left">
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
        <NavLink className="button tab-button tab-button-add" to={"/dashboard/create"}>
          Добавить данные
        </NavLink>
      </div>
      <div className="dashboard-topbar">
        <h3 className="dashboard-table-title">{getTableTitle(tabActive)}</h3>

        <div className="table-nav-right-block">
          <TableFilter
            label={"фильтровать по: "}
            id="filter-select"
            type="select"
            options={filterOptions}
            name="filter-select"
            selectHandle={handleFilterSelect}
          >
          </TableFilter>

          <TableSort
            label={"сортировать по: "}
            id="sort-select"
            type="select"
            options={sortOptions}
            name="sort-select"
            selectHandle={handleSortingSelect}
          >
          </TableSort>
        </div>
      </div>
      <TableSorted params={{ tab: tabActive, list: sortedList }}></TableSorted>
    </div>
  );
}
