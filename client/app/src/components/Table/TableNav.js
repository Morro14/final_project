import {
  useNavigate,
  useParams,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { filterFields, nameDict } from "../../utils/names";
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
        throw new Response("Not Found", { status: 404, statusText: r.response.statusText })
      }
    });
  return data;
}

export default function TableNav() {
  let category = useParams("value").value
  console.log('category', category)
  if (typeof (category) === 'undefined') {
    category = 'machines'
  }
  const navigate = useNavigate()
  const tableContext = useTableCon()
  const { filterCategory, filterEntity } = tableContext


  const user = useOutletContext().user
  const data = useLoaderData()

  // in case url is '/dashboard' and not '/dashboard/:value'
  const unsortedData = data.data[category]
  let tableData = unsortedData

  const getTableTitle = (category) => {
    const names = {
      machines: "Техника",
      maintenances: "Тех. обслуживания",
      reclamations: "Рекламации",
      references: "Справочные данные"
    };
    if (names[category]) {
      return names[category];
    }
  }

  const formattedData = formatHeaders(unsortedData[0])
  // TODO no unsorted list exception
  const sortNames = Object.keys(formattedData);
  const sortOptions = sortNames.map((n) => ({ "name": nameDict[n], "id": n }))
  const filterNames = filterFields[category]
  const filterOptions = filterNames.map((n) => ({ "name": nameDict[n], "id": n }))
  // get filter entities
  let filterEntities = [];
  if (filterCategory !== "") {
    filterEntities = unsortedData.map((e) => {
      const formattedEl = formatRowData(e)
      return (formattedEl[filterCategory])
    })
    let setF = new Set(filterEntities)
    filterEntities = [...setF]
    tableContext.setFilterEntity(filterEntities[0])
  }

  filterEntities = filterEntities.map((n, i) => ({ "name": n, "id": i }))

  // get fitlered data
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
  const checkGroup = (user) => {

    let check = user.groups.find((g) => g.name === 'Manager')
    return check;
  }

  const managerCheck = checkGroup(user);
  const renderRefTab = (access) => {
    if (access) {
      return <NavLink className="button tab-button tab-button-add" to={"/dashboard/references"}>
        Справочные данные
      </NavLink>
    }
  }

  // add edit column for references
  if (category === 'references') {
    tableData.forEach(k => {
      k["edit"] = { name: "edit", slug: k.name }
    })
  }

  return unsortedData.length === 0 ? (
    <div className="table-error-msg">Данных не найдено</div>
  ) : (
    <div className="table-container-main">

      <h1 className="dashboard-title">{managerCheck ? 'Менеджер ' + user.email : user.user_ref}</h1>
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
          {renderRefTab(managerCheck)}
        </div>
        <NavLink className="button tab-button tab-button-add" to={"/dashboard/create"}>
          Добавить данные
        </NavLink>
      </div>
      <div className="nav-container">
        <div className="nav-title">{getTableTitle(category)}</div>

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
            label={"объект"}
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
      <TableSorted params={{ tab: category, list: tableData }}></TableSorted>

    </div>
  );
}
