import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Truck, CreditCard, Calendar, CheckCircle } from "lucide-react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const authHeader = { Authorization: `Bearer ${userInfo?.token}` };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo || !userInfo.isAdmin) { navigate("/"); return; }
      try {
        setLoading(true);
        const { data } = await API.get("/orders", { headers: authHeader });
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const deliverHandler = async (id) => {
    try {
      setActionLoading(id + "-deliver");
      await API.put(`/orders/${id}/deliver`, {}, { headers: authHeader });
      toast.success("Marked as delivered");
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, isDelivered: true } : o))
      );
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const payHandler = async (id) => {
    try {
      setActionLoading(id + "-pay");
      await API.put(`/orders/${id}/pay`, {}, { headers: authHeader });
      toast.success("Marked as paid");
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, isPaid: true } : o))
      );
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (n) => "₹" + Number(n).toLocaleString("en-IN");
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  if (loading) {
    return (
      // ✅ p-3 mobile, p-6 desktop
      <div className="p-3 md:p-6 space-y-3">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-28 bg-white border border-gray-100
                                   rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-medium">Admin orders</h2>
        <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200
                         rounded-full px-3 py-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order._id}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden">

            {/* Top — ID + status badges
                ✅ wrap badges below ID on very small screens */}
            <div className="flex flex-wrap items-center justify-between gap-2
                            px-4 py-3 border-b border-gray-100">
              <span className="text-xs text-gray-400 font-mono">
                #{order._id.slice(-10).toUpperCase()}
              </span>
              <div className="flex gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                  ${order.isDelivered
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
                  {order.isDelivered ? "Delivered" : "Pending"}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full
                  ${order.isPaid
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"}`}>
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
            </div>

            {/* Stats
                ✅ 1 col on mobile, 3 col on sm+ — removes divide-x on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-gray-100">
              <div className="px-4 py-3 border-b border-gray-100 sm:border-b-0">
                <p className="text-xs text-gray-400 mb-1">Customer</p>
                <p className="text-sm font-medium truncate">
                  {order.user?.name || "—"}
                </p>
              </div>
              <div className="px-4 py-3 border-b border-gray-100 sm:border-b-0">
                <p className="text-xs text-gray-400 mb-1">Items</p>
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
            </div>

            {/* Footer — date + actions
                ✅ stack vertically on mobile, row on sm+ */}
            <div className="flex flex-col sm:flex-row sm:items-center
                            gap-2 px-4 py-2.5 border-t border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Calendar size={11} />
                {formatDate(order.createdAt)}
              </span>

              <div className="flex flex-wrap gap-2 sm:ml-auto">
                {order.isDelivered && order.isPaid ? (
                  <span className="flex items-center gap-1 text-xs text-green-700">
                    <CheckCircle size={12} /> All done
                  </span>
                ) : (
                  <>
                    {!order.isDelivered && (
                      <button
                        onClick={() => deliverHandler(order._id)}
                        disabled={actionLoading === order._id + "-deliver"}
                        className="flex items-center gap-1.5 text-xs font-medium
                                   px-3 py-1.5 rounded-lg bg-green-50 text-green-800
                                   border border-green-200 hover:bg-green-100
                                   disabled:opacity-50 transition-colors">
                        <Truck size={12} />
                        {actionLoading === order._id + "-deliver"
                          ? "Updating…" : "Mark delivered"}
                      </button>
                    )}
                    {!order.isPaid && (
                      <button
                        onClick={() => payHandler(order._id)}
                        disabled={actionLoading === order._id + "-pay"}
                        className="flex items-center gap-1.5 text-xs font-medium
                                   px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800
                                   border border-amber-200 hover:bg-amber-100
                                   disabled:opacity-50 transition-colors">
                        <CreditCard size={12} />
                        {actionLoading === order._id + "-pay"
                          ? "Updating…" : "Mark paid"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;