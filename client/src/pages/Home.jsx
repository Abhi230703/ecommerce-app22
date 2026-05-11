import { useState, useEffect, useMemo } from "react"
import API from "../services/api"
import ProductCard from "../component/ProductCard"
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SkeletonCard from "../component/common/SkeletonCard";
import { Search, SlidersHorizontal, Filter } from "lucide-react";
import Pagination from "../component/common/Pagination";
import CategoryPills from "../component/common/CategoryPills";
import { fetchCategories } from "../services/categoryService";

function Home() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const urlKeyword = params.get("keyword") || "";
  const [keyword, setKeyword] = useState(urlKeyword);
  const [minPrice, setMinPrice] = useState(params.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");
  const navigate = useNavigate();
  const [data, setData] = useState({ products: [], pages: 1, page: 1 });
  const [categories, setcategories] = useState([]);
  const selectedCategory = params.get("category") || "";

  useEffect(() => {
    fetchCategories().then(({ data }) => setcategories(data));
  }, []);

  const categoryHandler = (categoryId) => {
    const p = new URLSearchParams(location.search);
    categoryId ? p.set("category", categoryId) : p.delete("category");
    p.delete("page");
    navigate(`/?${p.toString()}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const query = location.search;
        const { data: resData } = await API.get(`/products${query}`);
        setData(resData);
        setProducts(resData.products);
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location.search]);

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate("/");
    }
  };

  const sortHandler = (e) => {
    const currentParams = new URLSearchParams(location.search);
    currentParams.set("sort", e.target.value);
    navigate(`/?${currentParams.toString()}`);
  };

  return (
    // ✅ px-3 on mobile, px-6 on desktop
    <div className="p-3 md:p-6">

      {/* Toolbar — stacks vertically on mobile */}
      <div className="flex flex-col gap-3 bg-white border border-gray-100
                      rounded-xl px-3 py-3 mb-6 md:px-4">

        {!loading && !error && (
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-700">
              All Products
              <span className="text-gray-400 font-normal ml-2">({products.length})</span>
            </h1>
          </div>
        )}

        {/* Search — full width on all screens */}
        <form onSubmit={searchHandler}
          className="flex items-center gap-2 w-full
                     bg-gray-50 border border-gray-200 rounded-lg px-3">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={keyword}
            placeholder="Search products…"
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 bg-transparent text-sm py-2 outline-none text-gray-900
                       placeholder:text-gray-400"
          />
        </form>

        {/* Price filter + Sort — wrap on 320px, row on wider */}
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal size={14} className="text-gray-400 shrink-0" />

          {/* ✅ w-16 on mobile, w-20 on sm+ */}
          <input
            type="text"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-16 sm:w-20 text-sm border border-gray-200 rounded-lg px-2 py-2
                       bg-gray-50 outline-none focus:border-gray-400"
          />
          <span className="text-gray-400 text-xs">–</span>
          <input
            type="text"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-16 sm:w-20 text-sm border border-gray-200 rounded-lg px-2 py-2
                       bg-gray-50 outline-none focus:border-gray-400"
          />

          <button
            className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200
                       rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            onClick={() => {
              const p = new URLSearchParams(location.search);
              keyword.trim() ? p.set("keyword", keyword) : p.delete("keyword");
              minPrice ? p.set("minPrice", minPrice) : p.delete("minPrice");
              maxPrice ? p.set("maxPrice", maxPrice) : p.delete("maxPrice");
              navigate(`/?${p.toString()}`);
            }}>
            <Filter size={13} /> Apply
          </button>

          {/* ✅ Sort pushed to new line on tiny screens via flex-wrap */}
          <select
            value={params.get("sort") || ""}
            onChange={sortHandler}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50
                       outline-none cursor-pointer text-gray-700 ml-auto">
            <option value="">Sort by price</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>
        </div>
      </div>

      <CategoryPills
        categories={categories}
        selected={selectedCategory}
        onSelect={categoryHandler}
      />

      {/* Grid — 1 col mobile, 2 col sm, 3 col md+ */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
          <div>
            <span className="flex items-center justify-between">{error}</span>
            <button onClick={() => window.location.reload()}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded">
              Retry
            </button>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-gray-700">No Products Found</h2>
          <p className="text-gray-500 mt-2">Try changing search or filter options.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-5 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            Clear Filters
          </button>
        </div>
      ) : (
        // ✅ 1 col → 2 col → 3 col
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(product => (<ProductCard key={product._id} product={product} />))}
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <Pagination pages={data.pages} page={data.page} />
      )}

    </div>
  );
}

export default Home;