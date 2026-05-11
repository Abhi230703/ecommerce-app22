import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Navbar from "./component/Navbar";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import CreateProduct from "./pages/admin/CreateProduct";
import UpdateProduct from "./pages/admin/UpdateProduct";
import AdminLayout from "./layout/AdminLayout";
import OrderDetails from "./pages/OrderDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {

  return (
   <Router>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/products/:id" element={<Product/>}/>

      <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>}/>
      <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
      <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
      <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails/></ProtectedRoute>}/>

      <Route path="/admin" element={<AdminRoute><AdminLayout/></AdminRoute>}>
      <Route path="orders" element={<AdminOrders/>}/>
      <Route path="orders/revenue" element={<AdminDashboard/>}/>
      <Route path="products" element={<AdminProducts/>}/>
      <Route path="products/create" element={<CreateProduct/>}/>
      <Route path="products/:id/edit" element={<UpdateProduct/>}/>
      </Route>
      
    </Routes>
    </Router>
  );
}

export default App;
