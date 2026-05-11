import { useState, useEffect } from "react";
import API from "../../services/api";

function AdminDashboard() {
  const [revenue, setRevenue] = useState(0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const fetchRevenue = async () => {
      const { data } = await API.get("/orders/revenue", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const orderRes = await API.get("/orders", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setOrders(orderRes.data);
      setRevenue(data.totalRevenue);
    };
    fetchRevenue();
  }, []);

  return (
    <div className="p-3 md:p-5">
      <h2 className="text-xl text-center text-gray-500 font-bold border mb-6">
        Admin Dashboard
      </h2>

      {/* ✅ 1 col on mobile, 3 col on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-gray-500">Total Revenue</h3>
          <p className="text-xl font-bold">₹{revenue}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-gray-500">Total Orders</h3>
          <p className="text-xl font-bold">{orders.length}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-gray-500">Delivered</h3>
          <p className="text-xl font-bold">
            {orders.filter((o) => o.isDelivered).length}
          </p>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;