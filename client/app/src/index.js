import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

export const serverURL = "http://127.0.0.1:8000/api";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <AuthProvider>
//         <App>
//           <Outlet></Outlet>
//         </App>
//       </AuthProvider>
//     ),
//     // loader: getTable,
//     // errorElement: <ErrorPage></ErrorPage>,
//     children: [
//       {
//         path: "/",
//         element: <PrivatRoute></PrivatRoute>,
//         children: [
//           {
//             path: "search/:id",
//             element: <SearchResults></SearchResults>,
//             loader: getDetails,
//           },
//         ],
//       },

//       {
//         path: "auth/",
//         element: <Authorization></Authorization>,
//       },

//       {
//         path: "dashboard/",
//         element: <PrivatRoute></PrivatRoute>,
//         children: [{ path: "dashboard/", element: <Dashboard></Dashboard> }],
//       },
//     ],
//   },
// ]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
