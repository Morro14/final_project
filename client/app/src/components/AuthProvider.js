import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../index.js";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [email, setUser] = useState(localStorage.getItem("email") || "");

  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const [exception, setException] = useState("");
  const navigate = useNavigate();

  const loginAction = async (data) => {
    await axios
      .post(serverURL + "/auth", data)
      .then((r) => {
        console.log("auth response", r);
        if (r.data && !r.data.error) {
          console.log(r.data);
          setUser(r.data.email);
          setToken(r.data.token);
          console.log("setting token to local storage", r.data.token);
          localStorage.setItem("site", r.data.token);
          localStorage.setItem("email", r.data.email);
          navigate("/dashboard/machines");
        } else {
          setException("invalid credentials");
        }
      })
      .catch((err) => {
        setException(err);
      });
  };

  const logoutAction = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ email, token, exception, loginAction, logoutAction }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
