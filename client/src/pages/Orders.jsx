import { useState,useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Package, Calendar, ArrowRight, ShoppingBag } from "lucide-react";


function Orders(){
    const [orders,setOrders] = useState([]);
     const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

   useEffect(() => {
    const fetchOrders = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) { navigate("/login"); return; }

      try {
        setLoading(true);
        const { data } = await API.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const statusStyles = {
    delivered:  "bg-green-50  text-green-800  border border-green-200",
    processing: "bg-amber-50  text-amber-800  border border-amber-200",
    cancelled:  "bg-red-50    text-red-800    border border-red-200",
    paid:       "bg-green-50  text-green-800  border border-green-200",
  };

   const getStatus = (order) => {
    if (order.isCancelled) return "cancelled";
    if (order.isDelivered) return "delivered";
    return "processing";
  };

  const formatPrice = (n) =>
    "₹" + Number(n).toLocaleString("en-IN");

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-28 bg-white border border-gray-100 
                                   rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]
                      text-gray-400">
        <ShoppingBag size={40} className="mb-3 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">No orders yet</p>
        <p className="text-xs mt-1">Your orders will appear here</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 text-sm border border-gray-200 rounded-lg 
                     hover:bg-gray-50 transition-colors">
          Browse products
        </button>
      </div>
    );
  }

    return(
         <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium">My orders</h2>
        <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 
                         rounded-full px-3 py-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      {/* Order cards */}
      <div className="space-y-3">
        {orders.map((order) => {
          const status = getStatus(order);
          return (
            <div key={order._id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden">

              {/* Top row — ID + status */}
              <div className="flex items-center justify-between px-4 py-3 
                              border-b border-gray-100">
                <span className="text-xs text-gray-400 font-mono">
                  #{order._id.slice(-10).toUpperCase()}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize
                                  ${statusStyles[status]}`}>
                  {status}
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                    <Package size={11} /> Items
                  </p>
                  <p className="text-sm font-medium">
                    {order.orderItems.length}{" "}
                    {order.orderItems.length === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-400 mb-1">Total</p>
                  <p className="text-sm font-medium">
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-400 mb-1">Payment</p>
                  <p className={`text-sm font-medium ${
                    order.isPaid ? "text-green-700" : "text-amber-700"
                  }`}>
                    {order.isPaid ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>

              {/* Footer — date + action */}
              <div className="flex items-center justify-between px-4 py-2.5 
                              border-t border-gray-100 bg-gray-50">
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Calendar size={11} />
                  {formatDate(order.createdAt)}
                </span>
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="text-xs text-purple-600 flex items-center gap-1 
                             hover:text-purple-800 transition-colors">
                  View details <ArrowRight size={11} />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
    );
}

export default Orders;