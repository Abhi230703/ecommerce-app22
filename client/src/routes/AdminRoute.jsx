import { Navigate } from "react-router-dom";

function AdminRoute({children}){
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if(!userInfo || !userInfo.token){
        return <Navigate to="/login" replace/>;
    }

    if(!userInfo.isAdmin === "admin"){
        return <Navigate to="/" replace/>;
    }

    return children;
}
export default AdminRoute;