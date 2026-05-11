function SkeletonCard() {
  return (
    <div className="bg-white p-4 shadow rounded animate-pulse">
      <div className="h-40 bg-gray-300 mb-3 rounded"></div>
      <div className="h-4 bg-gray-300 mb-2 rounded"></div>
      <div className="h-4 bg-gray-300 w-1/2 rounded"></div>
    </div>
  );
}

export default SkeletonCard;