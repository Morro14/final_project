import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../../index.js";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [email, setUser] = useState(localStorage.getItem("email") || "");

  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const [exception, setException] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginAction = async (data) => {
    setLoading(true);
    await axios
      .post(serverURL + "/auth", data)
      .then((r) => {


        if (r.data && r.data.token) {

          setUser(r.data.email);
          setToken(r.data.token);

          localStorage.setItem("site", r.data.token);
          localStorage.setItem("email", r.data.email);
          navigate("/dashboard/machines");
          setLoading(false)
        }
      })
      .catch((err) => {

        if (err.status === 401) {
          setException('401');
        } else {
          setException('server error');
        }
        setLoading(false);
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
      value={{ email, token, exception, loading, loginAction, logoutAction }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
