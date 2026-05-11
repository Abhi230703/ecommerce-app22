import { useState, useEffect } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchCategories } from "../../services/categoryService";

function CreateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories().then(({ data }) => setCategories(data));
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo?.token) { navigate("/login"); return; }

    try {
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("price", price);
      formdata.append("description", description);
      formdata.append("image", image);
      if (category) formdata.append("category", category);

      await API.post("/products", formdata, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product Created");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Error creating product");
    }
  };

  return (
    <form onSubmit={submitHandler} className="max-w-md bg-white p-6 shadow rounded">
      <h2 className="text-xl mb-4">Create Product</h2>

      <input className="border p-2 w-full mb-3" placeholder="Name"
        onChange={(e) => setName(e.target.value)} />

      <input className="border p-2 w-full mb-3" placeholder="Price"
        onChange={(e) => setPrice(e.target.value)} />

      <textarea className="border p-2 w-full mb-3" placeholder="Description"
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

export default CreateProduct;