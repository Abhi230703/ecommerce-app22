import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await API.get("/products?limit=999", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo?.token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    await API.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    toast.error("Product Deleted");
    window.location.reload();
  };

  return (
    <div className="p-3 md:p-4">
      <h2 className="text-xl p-3 md:p-5 text-center">Admin Products</h2>

      <button
        onClick={() => navigate("/admin/products/create")}
        className="bg-orange-500 mb-4 text-white px-3 py-2 rounded text-sm"
      >
        Create
      </button>

      {/* ✅ overflow-x-auto lets table scroll horizontally on 320–375px
          instead of breaking the layout */}
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full bg-white min-w-[420px]">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 md:p-3 text-sm">Name</th>
              <th className="p-2 md:p-3 text-sm">Price</th>
              <th className="p-2 md:p-3 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                {/* ✅ max-w + truncate prevents long names blowing the layout */}
                <td className="p-2 md:p-3 text-sm max-w-[160px] truncate">
                  {p.name}
                </td>
                <td className="p-2 md:p-3 text-sm whitespace-nowrap">
                  ₹{p.price}
                </td>
                <td className="p-2 md:p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/${p._id}/edit`)}
                      className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteHandler(p._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;