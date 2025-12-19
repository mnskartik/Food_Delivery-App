import { createContext, useState, ReactNode } from "react";

interface Item {
  _id: string;
  name: string;
  price: number;
}

interface CartItem {
  item: Item;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Item) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.item._id === item._id);
      if (exists) {
        return prev.map((c) =>
          c.item._id === item._id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const increaseQty = (id: string) => {
    setCart((prev) =>
      prev.map((c) =>
        c.item._id === id ? { ...c, qty: c.qty + 1 } : c
      )
    );
  };

  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.item._id === id ? { ...c, qty: c.qty - 1 } : c
        )
        .filter((c) => c.qty > 0) // ✅ remove item if qty = 0
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((c) => c.item._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
