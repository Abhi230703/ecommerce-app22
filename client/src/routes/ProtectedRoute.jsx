import { Navigate } from "react-router-dom";

function ProtectedRoute ({children}){
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if(!userInfo || !userInfo.token){
        return <Navigate to="/login" replace/>;
    }

    return children;
}

export default ProtectedRoute;