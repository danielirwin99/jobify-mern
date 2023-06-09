import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Loading from "../components/Loading";

// Children --> Whatever we wrap this .js file around --> In this case SharedLayout.jsx
const ProtectedRoute = ({ children }) => {
  // Pulling through the reducer functionality
  const { user, userLoading } = useAppContext();

  if (userLoading) return <Loading />;

  //   If there is no user --> Force them to the landing page
  if (!user) {
    return <Navigate to="/landing" />;
  }
  // If there is a user --> Bring them to the dashboard / shared layout page
  return children;
};

export default ProtectedRoute;
