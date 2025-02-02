import { Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider.js";
import { Navigate } from "react-router-dom";


const PrivateRoute = () => {
  const user = useAuth();
  if (!user.token) {
    return <Navigate to="/auth" />;
  } else {
    return (
      <>
        <Outlet user={user}></Outlet>
      </>
    );
  }
};

export default PrivateRoute;
