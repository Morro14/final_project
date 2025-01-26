import "./App.css";
import Dashboard from "./components/Dashboard.js";
import Main from "./components/Main.js";

import SearchResults from "./components/SearchResults.js";
import Search from "./components/Search.js";
import RefDetials, { refLoader } from "./components/RefDetails.js";

import { detailsLoader } from "./components/SearchResults.js";
import Authorization from "./components/Authorization.js";
import PrivatRoute from "./components/PrivatRoute.js";
import axios from "axios";
import { dashboardLoader } from "./components/Dashboard.js";

import {
  BrowserRouter as Router,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import TableNav, { sortedLoader } from "./components/TableNav.js";
import AddForm, { formLoader } from "./components/AddForm.js";
import AddFormReport from "./components/AddFormReport.js";
import AddFormIndex from "./components/AddFormIndex.js";

export const serverURL = "http://127.0.0.1:8000/api";

axios.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Token ${localStorage.getItem("site")}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Main />}>
        <Route path="/" element={<Search />}>
          <Route
            path="/search/:id"
            element={<SearchResults />}
            loader={detailsLoader}
          ></Route>
        </Route>
        <Route
          path="/details/:value"
          element={<RefDetials />}
          loader={refLoader}
        ></Route>
        <Route path="/auth" element={<Authorization />}></Route>

        <Route element={<PrivatRoute />}>
          <Route
            path="/dashboard"
            element={<Navigate to={"/dashboard/machines"} />}
          ></Route>

          <Route element={<Dashboard />} loader={dashboardLoader}>
            <Route

              loader={formLoader}
              path={"/dashboard/create/:category"}
              element={<AddForm />}
            ></Route>
            <Route
              path={"/dashboard/create/"}
              element={<AddFormIndex />}
            ></Route>
            <Route
              loader={sortedLoader}
              element={<TableNav />}
              path="/dashboard/:value"
            ></Route>
            <Route
              element={<AddFormReport />}
              path="/dashboard/create/report"
            ></Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
