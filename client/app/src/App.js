import "./App.css";
import Dashboard from "./components/Dashboard.js";
import Main from "./components/Main.js";

import SearchResults from "./components/SearchResults.js";
import Search from "./components/Search.js";
import RefDetials, { refLoader } from "./components/RefDetails.js";

import { detailsLoader } from "./components/SearchResults.js";
import Authorization from "./components/Auth/Authorization.js";
import PrivatRoute from "./components/Auth/PrivatRoute.js";
import axios from "axios";
import { dashboardLoader } from "./components/Dashboard.js";

import {
  BrowserRouter as Router,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import TableNav, { sortedLoader } from "./components/Table/TableNav.js";
import AddForm, { formLoader } from "./components/AddForm/AddForm.js";
import AddFormIndex from "./components/AddForm/AddFormIndex.js";
import MachineDetails, { machineLoader } from "./components/MachineDetails.js";
import ErrorComp from "./components/Errors/ErrorComp.js";
import { ErrorBoundary } from "./components/Errors/ErrorBoundary.js";
import { AddFormSuccess } from "./components/AddForm/AddFormSuccess.js";
import AddFormMain from "./components/AddForm/AddFormMain.js";
import EditForm, { editFormLoader } from "./components/AddForm/EditForm.js";

import SearchErrorComp from "./components/Errors/SearchError.js";

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
      <Route path="/" element={<Main />} errorElement={<ErrorBoundary />}>
        <Route path="/" element={<Search />}>
          <Route
            path="/search/:id"
            element={<SearchResults />}
            loader={detailsLoader}
            errorElement={<SearchErrorComp></SearchErrorComp>}
          ></Route>
        </Route>
        <Route
          path="/details/:value"
          element={<RefDetials />}
          loader={refLoader}
          errorElement={<ErrorComp></ErrorComp>}
        ></Route>
        <Route
          path="/details/machines/:value"
          element={<MachineDetails />}
          loader={machineLoader}
          errorElement={<ErrorComp></ErrorComp>}
        ></Route>
        <Route path="/auth" element={<Authorization />}></Route>

        <Route element={<PrivatRoute />}>
          <Route
            element={<Dashboard />}
            loader={dashboardLoader}
            path="/dashboard"
            errorElement={<ErrorComp></ErrorComp>}
          >
            <Route
              loader={editFormLoader}
              path={"/dashboard/edit/:category/:id"}
              element={<EditForm />}
              errorElement={<ErrorComp></ErrorComp>}
            ></Route>

            <Route
              path={"/dashboard/create/"}
              element={<AddFormMain />}
              errorElement={<ErrorComp></ErrorComp>}
            >
              <Route
                path={"/dashboard/create/"}
                element={<AddFormIndex />}
                errorElement={<ErrorComp></ErrorComp>}
              ></Route>
              <Route
                loader={formLoader}
                path={"/dashboard/create/:category"}
                element={<AddForm />}
                errorElement={<ErrorComp></ErrorComp>}
              ></Route>

              <Route
                path={"/dashboard/create/success"}
                element={<AddFormSuccess />}
                errorElement={<ErrorComp></ErrorComp>}
              ></Route>
            </Route>

            <Route
              loader={sortedLoader}
              errorElement={<ErrorComp></ErrorComp>}
              element={<TableNav />}
              path="/dashboard/:value"
            ></Route>
            <Route
              loader={sortedLoader}
              errorElement={<ErrorComp></ErrorComp>}
              element={<TableNav />}
              path="/dashboard"
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
