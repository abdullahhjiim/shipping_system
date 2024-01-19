import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const authData = useSelector((state) => state.auth);
  const { _token } = authData;

  return _token ? children : <Navigate to="/login" />;
}
