import { useNavigate, useLocation } from "react-router-dom";

function Pagination({ pages, page }) {
  const navigate = useNavigate();
  const location = useLocation();

  const query = location.search.replace(/page=\d+/, "");

  return (
    <div className="flex gap-2 mt-5 ">
      {[...Array(pages).keys()].map((x) => (
        <button
          key={x + 1}
          onClick={() => navigate(`?${query}&page=${x + 1}`)}
          className={`px-3 py-1 border rounded ${
            x + 1 === page ? "bg-black text-white" : ""
          }`}
        >
          {x + 1}
        </button>
      ))}
    </div>
  );
}

export default Pagination;