function CategoryPills({ categories=[], selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {/* All pill */}
      <button
        onClick={() => onSelect("")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
          ${selected === ""
            ? "bg-black text-white border-black"
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}>
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelect(cat._id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
            ${selected === cat._id
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}>
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryPills;