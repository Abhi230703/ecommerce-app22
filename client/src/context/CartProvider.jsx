// CartProvider.jsx — full fix with user switching support
import { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {

  const getUserId = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      return userInfo?._id || "guest";
    } catch {
      return "guest";
    }
  };

  const [userId, setUserId] = useState(getUserId);
  const cartKey = `cart_${userId}`;

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`cart_${getUserId()}`)) || [];
    } catch {
      return [];
    }
  });

  // ✅ When user logs in/out, reload the correct cart
  useEffect(() => {
    const handleStorageChange = () => {
      const newUserId = getUserId();
      if (newUserId !== userId) {
        setUserId(newUserId);
        try {
          setCart(JSON.parse(localStorage.getItem(`cart_${newUserId}`)) || []);
        } catch {
          setCart([]);
        }
      }
    };

    // Fires when localStorage changes (login/logout updates "userInfo")
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userId]);

  // ✅ Save to correct user's key
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exist = prev.find((item) => item._id === product._id);
      if (exist) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((item) => item._id !== productId));

  const decreaseQty = (productId) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, decreaseQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};