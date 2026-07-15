import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "vendio_cart";

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const STORAGE_PREFIX = "souklab_cart_";

function loadCartFor(userId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + (userId || "guest"));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [userId, setUserId] = useState(() => localStorage.getItem("access_token") ? "pending" : "guest");
  const [items, setItems] = useState(() => loadCartFor(userId));

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(items));
  }, [items, userId]);

  // Change de panier quand le compte change (connexion/déconnexion/inscription).
  useEffect(() => {
    function handleUserChanged(e) {
      const newUserId = e.detail || "guest";
      setUserId(newUserId);
      setItems(loadCartFor(newUserId));
    }
    window.addEventListener("user-changed", handleUserChanged);
    return () => window.removeEventListener("user-changed", handleUserChanged);
  }, []);

  function addItem(product, quantity = 1) {
    setItems((current) => {
      const existing = current.find((i) => i.product.id === product.id);
      if (existing) {
        return current.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...current, { product, quantity }];
    });
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  }

  function removeItem(productId) {
    setItems((current) => current.filter((i) => i.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé à l'intérieur de <CartProvider>");
  return ctx;
}
