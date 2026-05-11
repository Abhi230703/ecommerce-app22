import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingCart, MapPin, CheckCircle, Lock } from "lucide-react";


function Checkout (){
    const {cart,setCart} = useContext(CartContext);
    const navigate = useNavigate();
     const [loading, setLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const formatPrice = (n) => "₹" + Number(n).toLocaleString("en-IN");

  const placeOrder = async () => {
    if (!userInfo?.token) { navigate("/login"); return; }

    try {
      setLoading(true);
      const { data } = await API.post(
        "/orders",
        { orderItems: cart },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      console.log("Order success:", data);
      toast.success("Order placed successfully!");
      setCart([]);
      localStorage.removeItem("cart");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

    if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] 
                      text-gray-400 p-6">
        <ShoppingCart size={40} className="mb-3 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">Your cart is empty</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 text-sm border border-gray-200 rounded-lg 
                     hover:bg-gray-50 transition-colors text-gray-600">
          Browse products
        </button>
      </div>
    );
  }


    return(
        <div className="p-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

      {/* Left — order review */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Checkout</h2>

        {/* Items */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 
                          text-sm text-gray-500 font-medium">
            <ShoppingCart size={14} className="text-purple-500" />
            Items ({cart.length})
          </div>

          {cart.map((item) => (
            <div key={item._id}
              className="flex items-center gap-3 px-4 py-3 
                         border-b border-gray-100 last:border-b-0">
              <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-100 
                              flex items-center justify-center shrink-0 overflow-hidden">
                {item.image
                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  : <ShoppingCart size={16} className="text-gray-300" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatPrice(item.price)} × {item.qty}
                </p>
              </div>
              <p className="text-sm font-medium shrink-0">
                {formatPrice(item.price * item.qty)}
              </p>
            </div>
          ))}
        </div>

        {/* Delivery address */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 
                          text-sm text-gray-500 font-medium">
            <MapPin size={14} className="text-purple-500" />
            Delivery address
          </div>
          <div className="px-4 py-3 text-sm text-gray-500 leading-relaxed">
            {userInfo?.name} · Default address
          </div>
        </div>
      </div>

      {/* Right — payment summary */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 lg:sticky lg:top-20">
        <p className="text-sm font-medium mb-4">Payment summary</p>

        <div className="space-y-2.5 mb-4 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
        </div>

        <div className="flex justify-between text-sm font-medium pt-3 
                        border-t border-gray-100">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="w-full mt-4 py-2.5 bg-green-500 hover:bg-green-600 
                     disabled:opacity-60 disabled:cursor-not-allowed
                     text-white text-sm font-medium rounded-lg 
                     flex items-center justify-center gap-2 transition-colors">
          {loading ? (
            <>
              <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Placing order…
            </>
          ) : (
            <>
              <CheckCircle size={15} /> Place order
            </>
          )}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs 
                      text-gray-400 mt-3">
          <Lock size={10} /> Secure checkout
        </p>
      </div>

    </div>
    );
}

export default Checkout;