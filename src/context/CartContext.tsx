import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  shipping_cost: number;
  shop_id: string | number;
  shopName: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, qty: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  cartPulse: boolean;
  lastAddedItem: CartItem | null;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("CartContext not found");
  return ctx;
};

export const CartProvider = ({ children }: any) => {
const [cart, setCart] = useState<CartItem[]>(() => {
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
});

const [cartPulse, setCartPulse] = useState(false);
const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

const addToCart = (item: CartItem) => {
  setCart((prev) => {
    const existing = prev.find((p) => p.id === item.id);

    if (existing) {
      return prev.map((p) =>
        p.id === item.id
          ? { ...p, quantity: p.quantity + item.quantity }
          : p
      );
    }

    return [...prev, item]; // ✅ keep original quantity
  });

  setLastAddedItem(item);
  setCartPulse(true);
  setTimeout(() => setCartPulse(false), 600);
};

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string | number, qty: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: qty } : p
      )
    );
  };

  const clearCart = () => setCart([]);

  const getTotalItems = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        cartPulse,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};