import { Link } from "react-router-dom";

function ProductCard({ product }) {
    return (
         <Link 
            to={`/products/${product._id}`}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-1 hover:border-gray-300 transition-all duration-200 block"
        >
        <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:-translate-y-1 hover:border-gray-300 transition-all duration-200">

            {/* Image */}
            <div className="relative w-full h-44 bg-gray-50 overflow-hidden">
                <img
                    src={product.image || "https://placehold.co/300x200?text=Product"}
                    alt={product.name}
                    onError={(e) => { e.target.src = "https://placehold.co/300x200?text=No+Image"; }}
                    className="w-full h-full object-contain  group-hover:scale-105 transition-transform duration-300"
                />
                {/* Stock badge */}
                <span className="absolute top-2 left-2 bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    In stock
                </span>
            </div>

            {/* Body */}
            <div className="p-4">

                 {product.category && (
        <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full mb-2">
            {product.category.name}  
        </span>
    )}

                <h3 className="text-base font-bold text-gray-900 truncate mb-1">
                    {product.name}
                </h3>

                {/* Optional description — remove if not in your data */}
                {product.description && (
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                    </p>
                )}

                <div className="flex items-center justify-between mt-3">
                    <p className="text-base font-medium text-gray-900">
                        ₹{product.price.toLocaleString("en-IN")}  {/* ✅ formats 1000 → 1,000 */}
                    </p>
                   <span className="text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                        View details
                    </span>
                </div>

            </div>

        </div>
        </Link>
    );
}

export default ProductCard;