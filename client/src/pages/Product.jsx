import { useState, useEffect, useContext } from "react";
import { useParams,useNavigate } from "react-router-dom";
import API from "../services/api";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";


const getWishlistKey = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo?._id ? `wishlist_${userInfo._id}` : "wishlist_guest";
};


const getWishlist = () => {
  try {
    const stored = localStorage.getItem(getWishlistKey());
    if (!stored) return [];                        // null / missing key
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];    // guards against corrupted data
  } catch {
    return [];
  }
};


const saveWishlist = (list) =>
  localStorage.setItem(getWishlistKey(), JSON.stringify(list));

function Product() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [loading, setLoading] = useState(true);
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);

        const list = getWishlist();
        setWished(list.some((item)=>item._id === data._id));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    if (!product._id) return;

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if(!userInfo || !userInfo.token){
      toast.error("Please login to add to cart");
navigate("/login");
return;
    }

    const exist = cart.find((item) => item._id === product._id);
    let updatedCart;

    if (exist) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, qty: item.qty + qty }   
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, qty }];
    }

    setCart(updatedCart);
    toast.success(`Added ${qty} item${qty > 1 ? "s" : ""} to cart!`);
  };

  const toggleWishlist = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.token) {
      toast.error("Please login to save items");
      navigate("/login");
      return;
    }

  const list = getWishlist();

  if(wished){
    const updated = list.filter((item)=>item._id !== product._id);
    saveWishlist(updated);
    setWished(false);
    toast("Removed from wishlist",{icon:"🤍"});
  }
  else{
    const alreadyExists = list.some((item) => item._id === product._id);
if (!alreadyExists) {
  const updated = [...list, {
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
  }];
  saveWishlist(updated);
}
    setWished(true);
    toast("Saved to wishlist",{icon: "❤️" })
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Image */}
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => { e.target.src = "/placeholder-product.png" }}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
            In stock
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">

          <h1 className="text-2xl font-medium text-gray-900 leading-snug">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-medium text-gray-900">
              ₹{product.price?.toLocaleString("en-IN")}  {/* ✅ formats 12000 → 12,000 */}
            </span>
            <span className="text-xs text-gray-400">incl. all taxes</span>
          </div>

          <hr className="border-gray-100" />

          <p className="text-sm text-gray-500 leading-relaxed">
            {product.description}
          </p>

          {/* Qty selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Qty</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={addToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              <ShoppingCart size={16} />
              Add to cart
            </button>
            <button
              onClick={toggleWishlist}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${
                wished
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-400"
              }`}
            >
              <Heart size={16} fill={wished ? "currentColor" : "none"} />
            </button>
          </div>

          {/* ✅ wishlist label below button */}
          <p className="text-xs text-gray-400 -mt-2">
            {wished ? "Saved to wishlist" : "Save for later"}
          </p>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            {[
              { label: "Delivery", value: "2–4 days" },
              { label: "Returns",  value: "7-day free" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-gray-700">{value}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Product;