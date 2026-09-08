import React, { createContext, useContext, useState, useEffect } from "react";
import { Tool, CartItem, VerifiedOrderReceipt } from "../types/tool";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (tool: Tool, quantity?: number) => void;
  updateQuantity: (toolId: string, quantity: number) => void;
  removeFromCart: (toolId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeReceipt: VerifiedOrderReceipt | null;
  setActiveReceipt: (receipt: VerifiedOrderReceipt | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "desert_blooms_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<VerifiedOrderReceipt | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage write errors
    }
  }, [cartItems]);

  const addToCart = (tool: Tool, quantity: number = 1) => {
    if (quantity <= 0) return;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.tool.id === tool.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { tool, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (toolId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(toolId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.tool.id === toolId ? { ...item, quantity: Math.min(quantity, 99) } : item
      )
    );
  };

  const removeFromCart = (toolId: string) => {
    setCartItems((prev) => prev.filter((item) => item.tool.id !== toolId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.tool.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        activeReceipt,
        setActiveReceipt,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
