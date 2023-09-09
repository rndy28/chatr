import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "~/contexts/UserContext";

const Protected = () => {
  const { user } = useUser();

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

const Public = () => {
  const { user } = useUser();

  return !user ? <Outlet /> : <Navigate to="/signin" />;
};

export { Protected, Public };
