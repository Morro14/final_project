import "../styles/Dashboard.css";
import { serverURL } from "../App.js";
import axios from "axios";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import ErrorComp from "./ErrorComp.js";

export async function dashboardLoader({ params }) {
  const data = await axios
    .get(serverURL + `/dashboard`)
    .then((r) => {
      return r;
    })
    .catch((e) => {
      return e;
    });
  return data;
}

export default function Dashboard({ children }) {
  const response = useLoaderData();
  let client = response.data.client;


  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Outlet context={{ client: client }}></Outlet>
      </div>
    </div>
  );
}
