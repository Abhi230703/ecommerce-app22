import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";

function Cart() {
     const navigate = useNavigate();
     const { cart, removeFromCart } = useContext(CartContext);

     const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const formatPrice = (n) =>
    "₹" + Number(n).toLocaleString("en-IN");

  // Empty state
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] 
                      text-gray-400 p-6">
        <ShoppingCart size={40} className="mb-3 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">Your cart is empty</p>
        <p className="text-xs mt-1 text-gray-400">Add some products to get started</p>
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

      {/* Left — item list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Cart</h2>
          <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 
                           rounded-full px-3 py-1">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item._id}
              className="bg-white border border-gray-100 rounded-xl px-4 py-3 
                         flex items-center gap-4">

              {/* Thumbnail placeholder */}
              <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-100 
                              flex items-center justify-center shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name}
                    className="w-full h-full object-cover" />
                ) : (
                  <ShoppingCart size={20} className="text-gray-300" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatPrice(item.price)} / unit
                </p>
              </div>

              {/* Right — qty + remove */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs text-gray-500 border border-gray-200 
                                 rounded-full px-2.5 py-0.5">
                  Qty: {item.qty}
                </span>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="flex items-center gap-1 text-xs text-red-500 
                             hover:text-red-700 transition-colors">
                  <Trash2 size={11} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — order summary */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 lg:sticky lg:top-20">
        <p className="text-sm font-medium mb-4">Order summary</p>

        <div className="space-y-2.5 mb-4">
          {cart.map((item) => (
            <div key={item._id}
              className="flex justify-between text-sm text-gray-500">
              <span className="truncate mr-2">
                {item.name} × {item.qty}
              </span>
              <span className="shrink-0">
                {formatPrice(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-sm font-medium pt-3 
                        border-t border-gray-100">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full mt-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white 
                     text-sm font-medium rounded-lg flex items-center justify-center 
                     gap-2 transition-colors">
          Proceed to checkout <ArrowRight size={15} />
        </button>
      </div>

    </div>
    );

}

export default Cart;