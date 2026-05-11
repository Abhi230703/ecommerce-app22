import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import toast from "react-hot-toast";
import { fetchCategories } from "../../services/categoryService";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setCategory(data.category?._id || data.category || ""); // ← handles both populated and raw id
      } catch (error) {
        console.log(error);
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo?.token) { navigate("/login"); return; }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      if (image) formData.append("image", image);

      await API.put(`/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product Updated");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Update Failed");
    }
  };

  return (
    <form onSubmit={submitHandler} className="max-w-md bg-white p-6 shadow rounded">
      <h2 className="text-xl mb-4">Edit Product</h2>

      <input className="border p-2 w-full mb-3" value={name} placeholder="Name"
        onChange={(e) => setName(e.target.value)} />

      <input className="border p-2 w-full mb-3" value={price} placeholder="Price"
        onChange={(e) => setPrice(e.target.value)} />

      <input className="border p-2 w-full mb-3" value={description} placeholder="Description"
        onChange={(e) => setDescription(e.target.value)} />

      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 w-full mb-3 text-gray-700">
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <input className="border p-2 w-full mb-3" type="file"
        onChange={(e) => setImage(e.target.files[0])} />

      <button className="bg-green-500 px-3 py-2 text-white rounded w-full" type="submit">
        Submit
      </button>
    </form>
  );
}

export default UpdateProduct;