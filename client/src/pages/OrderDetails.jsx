import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import API from "../services/api";
import { ArrowLeft, Calendar, Package, MapPin, CreditCard } from "lucide-react";
import toast from "react-hot-toast";


export default function OrderDetails(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [order,setOrder] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const fetchOrders = async() =>{
         const userInfo = JSON.parse(localStorage.getItem("userInfo"));

         if(!userInfo?.token){navigate("/login"); return;};

            try {
                const {data} = await API.get(`/orders/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },});
                  setOrder(data);
            } catch (error) {
               console.log(error);
                toast.error("Failed to load order");
            }
            finally{
                setLoading(false);
            }
        }
         
                   fetchOrders();
    },[id]);

    if(loading) return <div className="p-6 text-center bg-gray-400">Loading....</div>
    if(!order) return <div className="p-6 text-center bg-red-400">Order not Found</div>

     return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Order Details</h1>
      </div>

      {/* Order ID + status */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
        <p className="text-xs text-gray-400">Order ID</p>
        <p className="font-mono text-sm text-gray-700">{order._id}</p>
       <span
  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium
    ${
      order.isDelivered
        ? "bg-green-100 text-green-700"
        : order.isPaid
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
>
  {order.isDelivered
    ? "Delivered"
    : order.isPaid
    ? "Paid"
    : "Pending"}
</span>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Package size={15} /> Items
        </p>
        {order.orderItems?.map((item, i) => (
          <div key={i} className="flex justify-between text-sm text-gray-600 border-b border-gray-50 pb-2 last:border-0">
            <span>{item.name} × {item.qty}</span>
            <span className="font-medium">₹{item.price}</span>
          </div>
        ))}
      </div>

      {/* Delivery address */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-1">
        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin size={15} /> Delivery Address
        </p>
        <p className="text-sm text-gray-500">{order.address || "Default Address"}</p>
      </div>

      {/* Payment summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
        <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <CreditCard size={15} /> Payment
        </p>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total</span>
          <span className="font-semibold text-gray-800">₹{order.totalPrice}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Method</span>
          <span>{order.paymentMethod || "UPI / Cash on Delivery / Credit Card"}</span>
        </div>
      </div>

      {/* Date */}
      <p className="text-xs text-gray-400 flex items-center gap-1.5">
        <Calendar size={11} /> Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>

    </div>
  );
}

