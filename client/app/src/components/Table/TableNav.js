import {
  useNavigate,
  useParams,
  useLoaderData,
  useOutletContext,
} from "react-router-dom";
import { filterFields, nameDict } from "../../utils/names";
import TableSorted from "./TableSorted";
import axios from "axios";
import { serverURL } from "../../App";
import { NavLink } from "react-router-dom";

import { formatHeaders, formatRowData } from "../../utils/formatting";
import TableFilter from "./TableFilter";
import TableSort from "./TableSort";
import TableFilterEntities from "./TableFilterEntities";

import { useTableCon } from "./TableContext";
import "../../styles/TableNav.css";
import { useState } from "react";

import { DownloadTableExcel } from "react-export-table-to-excel";

export async function sortedLoader({ params, request }) {
  const category = params.value ? params.value : "machines";
  let sorting = new URL(request.url).searchParams.get("sorting");
  let filter = new URL(request.url).searchParams.get("filter");

  // default sorting
  if (!sorting) {
    switch (category) {
      case "machines":
        sorting = "shipment_date";

        break;
      case "maintenances":
        sorting = "mt_date";
        break;
      case "reclamations":
        sorting = "refuse_date";
        break;
      case "references":
        sorting = "ref_type";
        break;
    }
  }
  const sortingURL = `?sorting=${sorting}`;
  const requestURL = serverURL + "/dashboard/" + category + sortingURL;

  const data = await axios
    .get(requestURL)
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

export default function TableNav() {
  const [loading, setLoading] = useState(false);
  let category = useParams("value").value;

  // in case url is '/dashboard' and not '/dashboard/:value'
  if (typeof category === "undefined") {
    category = "machines";
  }
  const navigate = useNavigate();
  const tableContext = useTableCon();

  const [tab, setTab] = useState(category);

  const user = useOutletContext().user;
  const userType = user.user_type;

  const data = useLoaderData();
  const unsortedData = data.data[category];

  let tableData = unsortedData;
  const loadingTab = tab !== category;

  // title
  const getTableTitle = (category) => {
    const names = {
      machines: "Техника",
      maintenances: "Тех. обслуживания",
      reclamations: "Рекламации",
      references: "Справочные данные",
    };
    if (names[category]) {
      return names[category];
    }
  };
  // check if data
  const [dataCheck, setDataCheck] = useState(true);

  if (!unsortedData[0] && dataCheck) {
    setDataCheck(false);
  }
  if (unsortedData[0] && !dataCheck) {
    setDataCheck(true);
  }

  // get headers
  let headers = [];
  if (unsortedData[0]) {
    headers = formatHeaders(unsortedData[0]);
  }

  headers = Object.keys(headers).filter((f) => f !== "edit");
  // get sorting options
  const sortOptions = headers.map((n) => ({ name: nameDict[n], id: n }));
  //get filter category options
  const filterNames = filterFields[category];
  const filterCategories = filterNames.map((n) => ({
    name: nameDict[n],
    id: n,
  }));

  const [filterState, setFilterState] = useState({
    categories: filterCategories,
    entities: [],
    category: "",
    entity: "",
  });
  // reset filter
  if (filterState.categories.length === 0 && !loadingTab) {
    setFilterState({ ...filterState, categories: filterCategories });
  }

  // disable tag for entity filter
  const [disableTag, setDisableTag] = useState("true");

  //
  const emptyOption = [{ label: "нет фильтра" }];

  const getFilterEntOptions = (filterCat) => {
    setDisableTag("false");

    let filterEnts = [].concat(
      emptyOption,
      unsortedData.map((e) => {
        const formattedEl = formatRowData(e);

        return formattedEl[filterCat];
      })
    );

    let uniqueLabels = new Set();

    filterEnts = filterEnts.filter((e) => {
      if (!uniqueLabels.has(e.label)) {
        uniqueLabels.add(e.label);
        return true;
      } else {
        return false;
      }
    });
    return filterEnts;
  };

  // get fitlered data
  if (filterState.entity !== "") {
    tableData = unsortedData.filter((el) => {
      const formattedEl = formatRowData(el);
      return formattedEl[filterState.category]["label"] === filterState.entity;
    });
  }
  // reset filtered data
  if (filterState.category === "" || filterState.entity === "") {
    tableData = unsortedData;
  }

  const handleFilterCatSelect = (e) => {
    e.preventDefault();

    let newFilterState = { ...filterState };
    if (e.target.value === "") {
      newFilterState["category"] = "";
      newFilterState["entity"] = "";
      newFilterState["entities"] = [];
      setFilterState(newFilterState);

      setDisableTag("true");
    } else {
      newFilterState["category"] = e.target.value;
      newFilterState["entities"] = getFilterEntOptions(e.target.value);
      newFilterState["entity"] = "";
      setFilterState(newFilterState);
    }
  };

  const handleFilterEntSelect = (e) => {
    e.preventDefault();
    let newFilterState = { ...filterState };
    newFilterState["entity"] = e.target.value;
    setFilterState(newFilterState);
  };

  const [sortState, setSortState] = useState({
    options: sortOptions,
    sortOption: "",
  });
  // reset sorting
  if (sortState.options.length === 0 && !loadingTab) {
    setSortState({ ...sortState, options: sortOptions });
  }
  const handleSortingSelect = (e) => {
    e.preventDefault();
    let newState = { ...sortState };
    newState[sortOptions] = e.target.value;
    navigate("/dashboard/" + category + "?sorting=" + e.target.value);
    setSortState(newState);
  };

  const checkGroup = (user) => {
    let check = user.groups.find((g) => g.name === "Manager");
    return check;
  };
  // check if user is manager
  const managerCheck = checkGroup(user);
  // reset filters on changing tabs
  const tabOnClick = (e) => {
    switch (e.target.pathname) {
      case "/dashboard/reclamations":
        setTab("reclamations");
        break;
      case "/dashboard/maintenances":
        setTab("maintenances");
        break;
      case "/dashboard/machines":
        setTab("machines");
        break;
      case "/dashboard/references":
        setTab("references");
        break;
    }
    setSortState({
      options: [],
      sortOption: "",
    });
    setFilterState({
      categories: [],
      entities: [],
      category: "",
      entity: "",
    });
  };

  //render tab if user has access
  const renderRefTab = (access) => {
    if (access) {
      return (
        <NavLink
          className="button tab-button"
          to={"/dashboard/references"}
          onClick={tabOnClick}
        >
          Справочные данные
        </NavLink>
      );
    }
  };

  // add edit column
  if (managerCheck) {
    tableData = tableData.map((k) => {
      return Object.assign({ edit: {} }, k);
    });
  }
  if (
    userType === "service" &&
    (category === "maintenances" || category === "reclamations")
  ) {
    tableData = tableData.map((k) => {
      return Object.assign({ edit: {} }, k);
    });
  }
  if (userType === "client" && category === "maintenances") {
    tableData = tableData.map((k) => {
      return Object.assign({ edit: {} }, k);
    });
  }
  // export
  const tableRef = tableContext.tableRef;

  const tableDownloadEl = () => {
    return (
      <DownloadTableExcel
        filename={`silant-table-${category}`}
        sheet={category}
        currentTableRef={tableRef.current}
      >
        <button className="export-button button" disabled={!dataCheck}>
          экспорт
        </button>
      </DownloadTableExcel>
    );
  };
  return (
    <div className="table-container-main">
      <h1 className="dashboard-title">
        {managerCheck ? "Менеджер " + user.email : user.user_ref}
      </h1>
      <h4 className="dashboard-info">
        {managerCheck
          ? "Просмотр всех данных"
          : "Информация о комплектации и характеристиках вашей техники"}
      </h4>
      <div className="tab-bar">
        <div className="tab-bar-left">
          <NavLink
            className="button tab-button"
            onClick={tabOnClick}
            to={"/dashboard/machines"}
          >
            Техника
          </NavLink>
          <NavLink
            className="button tab-button"
            onClick={tabOnClick}
            to={"/dashboard/maintenances"}
          >
            Т.О.
          </NavLink>
          <NavLink
            className="button tab-button"
            onClick={tabOnClick}
            to={"/dashboard/reclamations"}
          >
            Рекламации
          </NavLink>
          {renderRefTab(managerCheck)}
        </div>
        <NavLink
          className="button tab-button tab-button-add"
          to={"/dashboard/create"}
        >
          Добавить данные
        </NavLink>
      </div>
      <div className="nav-container">
        <div className="nav-title-export-container">
          <div className="nav-title">{getTableTitle(category)}</div>
          {tableContext.tableRef ? tableDownloadEl() : ""}
        </div>
        <div className="filter-sort-block">
          <div className="filter-block">
            <div className="filter-block-label">фильтровать по: </div>
            <div className="filter-select-elements">
              <TableFilter
                id="filter-cat-select"
                type="select"
                options={filterState.categories}
                name="filter-cat-select"
                selectHandle={handleFilterCatSelect}
                disableTag={dataCheck}
              ></TableFilter>
              <TableFilterEntities
                id="filter-entity-select"
                type="select"
                options={filterState.entities}
                name="filter-entity-select"
                selectHandle={handleFilterEntSelect}
                disableTag={disableTag}
                selectValue={filterState.entity}
              ></TableFilterEntities>
            </div>
          </div>
          <div className="select-block">
            <div className="select-block-label">сортировать по: </div>
            <TableSort
              id="sort-select"
              type="select"
              options={sortState.options}
              name="sort-select"
              selectHandle={handleSortingSelect}
              disableTag={!dataCheck}
            ></TableSort>
          </div>
        </div>
      </div>
      {dataCheck ? (
        <TableSorted
          params={{
            tab: category,
            list: tableData,
            dataCheck: dataCheck,
          }}
        ></TableSorted>
      ) : (
        <>Нет данных</>
      )}
    </div>
  );
}
