import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function RootRedirect() {
    return isAuthenticated()
        ? <Navigate to="/dashboard" replace />
        : <Navigate to="/signin" replace />;
}
