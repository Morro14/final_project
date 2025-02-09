import "../styles/Dashboard.css";
import { serverURL } from "../App.js";
import axios from "axios";
import { Outlet, useLoaderData } from "react-router-dom";

import TableConProvider from "./Table/TableContext.js";

export async function dashboardLoader({ params }) {
  const data = await axios
    .get(serverURL + `/dashboard`)
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

export default function Dashboard({ children }) {
  const response = useLoaderData();
  let user = response.data.user;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <TableConProvider>
          <Outlet context={{ user: user }}></Outlet>
        </TableConProvider>
      </div>
    </div>
  );
}
