import "../styles/Dashboard.css";
import { serverURL } from "../App.js";
import axios from "axios";
import { NavLink, Outlet, useLoaderData } from "react-router-dom";
import ErrorComp from "./Errors/ErrorComp.js";
import TableConProvider from "./Table/TableContext.js";
import { data } from 'react-router-dom'

export async function dashboardLoader({ params }) {
  const data = await axios
    .get(serverURL + `/dashboard`)
    .then((r) => {
      return r;
    }).catch((r) => {

      if (r.status !== 200) {

        throw new Response("Not Found", { status: 404, statusText: r.response.statusText })
      }
    })
    ;
  return data;
}
export async function testLoader() {
  throw new Response("Not Found", { status: 404 })
}
export default function Dashboard({ children }) {
  const response = useLoaderData();
  let client = response.data.client;


  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <TableConProvider>
          <Outlet context={{ client: client }}></Outlet>
        </TableConProvider>
      </div>
    </div>
  );
}
