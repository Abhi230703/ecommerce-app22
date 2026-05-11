import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Package, PackagePlus, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const linkCls = "flex items-center gap-2 hover:text-gray-300 py-1";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar
          — desktop: static, always visible (w-1/5)
          — mobile:  fixed drawer, slides in/out via translate */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64
        bg-gray-900 text-white p-5 flex flex-col flex-shrink-0
        transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:w-1/5 md:flex
      `}>

        {/* Header row — close button on mobile */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Admin Panel</h2>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-3 flex-1">
          <Link to="/admin/orders/revenue" onClick={() => setSidebarOpen(false)} className={linkCls}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/admin/products" onClick={() => setSidebarOpen(false)} className={linkCls}>
            <Package size={18} /> Products
          </Link>
          <Link to="/admin/orders" onClick={() => setSidebarOpen(false)} className={linkCls}>
            <ShoppingBag size={18} /> Orders
          </Link>
          <Link to="/admin/products/create" onClick={() => setSidebarOpen(false)} className={linkCls}>
            <PackagePlus size={18} /> Add Products
          </Link>

          <button
          onClick={logoutHandler}
          className="mt-20 bg-red-500 px-3 py-2 rounded w-full flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
        </nav>

        
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile topbar — hamburger + title */}
        <div className="md:hidden flex items-center gap-3 bg-gray-900 text-white px-4 h-14 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="text-gray-300 hover:text-white"
          >
            <Menu size={22} />
          </button>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>

        {/* ✅ Scrollable content area */}
        <div className="flex-1 p-3 md:p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;