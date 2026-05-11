import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, Home, FileText, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { cart, clearCart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    clearCart();
    localStorage.removeItem("userInfo");
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  // ✅ Fix: isAdmin is boolean true/false, not "admin"/"user"
  const isAdmin = user?.isAdmin === "admin";

  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-100">

      {/* Main bar */}
      <div className="flex items-center justify-between px-3 md:px-6 h-14">

        <Link to="/" className="flex items-center gap-2 font-medium text-gray-900">
          <ShoppingCart size={18} className="text-purple-500" />
          E-Shop
        </Link>

        {/* Desktop links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
          <DesktopLinks
            user={user}
            isAdmin={isAdmin}
            cart={cart}
            logoutHandler={logoutHandler}
          />
        </div>

        {/* Mobile right side — cart badge + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {user && !isAdmin && (
            <Link to="/cart" className="relative p-2 text-gray-500">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-purple-500 text-white
                                 text-[9px] font-medium w-4 h-4 rounded-full
                                 flex items-center justify-center leading-none">
                  {cart.length}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-3 py-2 flex flex-col gap-1">
          {isAdmin ? (
            <MobileLink to="/admin/orders/revenue" icon={<LayoutDashboard size={15} />} onClick={closeMenu}>
              Admin Panel
            </MobileLink>
          ) : (
            <>
              <MobileLink to="/" icon={<Home size={15} />} onClick={closeMenu}>Home</MobileLink>
              <MobileLink to="/orders" icon={<FileText size={15} />} onClick={closeMenu}>Orders</MobileLink>
              <MobileLink to="/cart" icon={<ShoppingCart size={15} />} onClick={closeMenu}>
                Cart {cart.length > 0 && <span className="ml-1 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{cart.length}</span>}
              </MobileLink>
            </>
          )}

          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
                <User size={13} />
                <span>Hi, {user.name[0].toUpperCase() + user.name.slice(1)} 👋</span>
              </div>
              <button
                onClick={logoutHandler}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                           text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut size={13} /> Logout
              </button>
            </>
          ) : (
            <>
              <MobileLink to="/login" onClick={closeMenu}>Login</MobileLink>
              <MobileLink to="/register" onClick={closeMenu} highlight>Register</MobileLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// Desktop links — extracted for clarity
function DesktopLinks({ user, isAdmin, cart, logoutHandler }) {
  const linkCls = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors";

  return (
    <>
      {isAdmin ? (
        <Link to="/admin/orders/revenue" className={linkCls}>
          <LayoutDashboard size={15} /> Admin Panel
        </Link>
      ) : user ? (
        <>
          <Link to="/" className={linkCls}><Home size={15} /> Home</Link>
          <Link to="/orders" className={linkCls}><FileText size={15} /> Orders</Link>
          <Link to="/cart" className={`${linkCls} relative`}>
            <ShoppingCart size={15} /> Cart
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white
                               text-[10px] font-medium w-4 h-4 rounded-full
                               flex items-center justify-center leading-none">
                {cart.length}
              </span>
            )}
          </Link>
        </>
      ) : null}

      {user ? (
        <>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 border border-gray-200">
            <User size={13} />
            <span>Hi, {user.name[0].toUpperCase() + user.name.slice(1)} 👋</span>
          </div>
          <button
            onClick={logoutHandler}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                       text-gray-500 border border-gray-200 hover:bg-red-50
                       hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <LogOut size={13} /> Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-3 py-1.5 rounded-lg text-sm bg-purple-500 text-white hover:bg-purple-600 transition-colors">
            Register
          </Link>
        </>
      )}
    </>
  );
}

// Mobile menu link helper
function MobileLink({ to, icon, onClick, children, highlight }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
        ${highlight
          ? "bg-purple-500 text-white hover:bg-purple-600"
          : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {icon} {children}
    </Link>
  );
}

export default Navbar;