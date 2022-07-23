import { useUser } from "libs/contexts/UserContext";
import { Outlet, Navigate } from "react-router-dom";

const Protected = () => {
  const { user } = useUser();

  return user ? <Outlet /> : <Navigate to="/signin" />;
};

const Public = () => {
  const { user } = useUser();

  return !user ? <Outlet /> : <Navigate to="/get-started" />;
};

export { Protected, Public };
