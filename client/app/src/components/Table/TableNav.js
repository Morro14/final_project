import {
  useNavigate,
  useParams,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { filterFields, nameDict, sortLabels } from "../../utils/names";
import TableSorted from "./TableSorted";
import axios from "axios";
import { serverURL } from "../../App";
import { NavLink } from "react-router-dom";

import { formatHeaders, formatRowData } from "../../utils/formatting";
import TableFilter from "./TableFilter";
import TableSort from "./TableSort";
import TableFilterEntities from "./TableFilterEntities"

import { useTableCon } from "./TableContext";
import '../../styles/TableNav.css'



export async function sortedLoader({ params, request }) {
  const category = params.value;
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
  const requestURL = serverURL + "/dashboard/" + category + sortingURL


  const data = await axios
    .get(requestURL)
    .then((r) => {
      return r;
    })
    .catch((r) => {
      if (r.status !== 200) {
        console.log(r)
        throw new Response("Not Found", { status: 404, statusText: r.response.statusText })
      }
    });
  return data;
}

export default function TableNav() {
  const category = useParams("value").value;
  const navigate = useNavigate()
  const tableContext = useTableCon();
  const { filterCategory, filterEntity } = tableContext
  const tabActive = useParams().value;
  const client = useOutletContext().client;
  const data = useLoaderData();
  const unsortedData = data.data[tabActive];
  let tableData = unsortedData;

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

  const formattedData = formatHeaders(unsortedData[0])
  // TODO no unsorted list exception
  const sortNames = Object.keys(formattedData);

  const sortOptions = sortNames.map((n) => ({ "name": nameDict[n], "id": n }))

  const filterNames = filterFields[tabActive]
  const filterOptions = filterNames.map((n) => ({ "name": nameDict[n], "id": n }))

  let filterEntities = [];
  if (filterCategory !== "") {
    unsortedData.forEach((e) => {
      const formattedEl = formatRowData(e)
      filterEntities.push(formattedEl[filterCategory])
    })
    let setF = new Set(filterEntities)
    filterEntities = [...setF]
  }

  filterEntities = filterEntities.map((n, i) => ({ "name": n, "id": i }))


  if (filterEntity !== "") {

    const sortedData = unsortedData.filter(el => {
      const formattedEl = formatRowData(el)
      return formattedEl[filterCategory] === filterEntity
    })
    tableData = sortedData
  }

  const handleFilterCatSelect = (e) => {
    e.preventDefault();
    tableContext.setFilterEntity('')
    tableContext.setFilterCategory(e.target.value)

  };

  const handleFilterEntSelect = (e) => {
    e.preventDefault();
    tableContext.setFilterEntity(e.target.value)
  };

  const handleSortingSelect = (e) => {
    e.preventDefault();
    navigate('/dashboard/' + category + '?sorting=' + e.target.value)
    tableContext.setSorting(e.target.value)
  };
  const checkGroup = (client) => {

    let check = client.groups.find((g) => g.name === 'Manager')
    return check;
  }
  const managerCheck = checkGroup(client);

  return unsortedData.length === 0 ? (
    <div className="table-error-msg">Данных не найдено</div>
  ) : (
    <div className="table-container-main">

      <h1 className="dashboard-title">{managerCheck ? 'Менеджер ' + client.name : client.name}</h1>
      <h4 className="dashboard-info">
        {managerCheck ? 'Просмотр всех данных' : 'Информация о комплектации и характеристиках вашей техники'}

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
      <div className="nav-container">
        <div className="nav-title">{getTableTitle(tabActive)}</div>

        <div className="filter-block">
          <div className="filter-block-label">фильтровать по: </div>
          <TableFilter
            label={"категория"}
            id="filter-cat-select"
            type="select"
            options={filterOptions}

            name="filter-cat-select"
            selectHandle={handleFilterCatSelect}
          >
          </TableFilter>
          <TableFilterEntities
            label={"сущность"}
            id="filter-entity-select"
            type="select"

            options={filterEntities}
            name="filter-entity-select"
            selectHandle={handleFilterEntSelect}
          >
          </TableFilterEntities>


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
      <TableSorted params={{ tab: tabActive, list: tableData }}></TableSorted>

    </div>
  );
}
