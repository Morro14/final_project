import { Outlet } from "react-router-dom";
import "../styles/Buttons.css";

import Footer from "./Footer.js";
import "../App.css";

import Header from "./Header.js";
import AuthProvider from "./Auth/AuthProvider.js";

export default function Main() {
  return (
    <AuthProvider>
      <Header></Header>
      <div className="container-main">
        <div className="container-main-inner container-search">
          <Outlet></Outlet>
        </div>
      </div>
      <Footer></Footer>
    </AuthProvider>
  );
}
