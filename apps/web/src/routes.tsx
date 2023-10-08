import { Navigate, Outlet } from "react-router-dom";
import { useRoot } from "./contexts/RootContext";

const Protected = () => {
  const { user } = useRoot();

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

const Public = () => {
  const { user } = useRoot();

  return !user ? <Outlet /> : <Navigate to="/" />;
};

export { Protected, Public };
