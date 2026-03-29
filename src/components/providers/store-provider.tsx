"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  slug: string;
  quantity: number;
  shade?: string;
};

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  query: string;
  setQuery: (value: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  toggleWishlist: (slug: string) => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "ellena-cosmetics-cart";
const WISHLIST_KEY = "ellena-cosmetics-wishlist";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const savedCart = window.localStorage.getItem(CART_KEY);
    const savedWishlist = window.localStorage.getItem(WISHLIST_KEY);

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlist,
      query,
      setQuery,
      addToCart: (item) => {
        setCart((current) => {
          const existing = current.find(
            (entry) => entry.slug === item.slug && entry.shade === item.shade,
          );

          if (!existing) {
            return [...current, item];
          }

          return current.map((entry) =>
            entry.slug === item.slug && entry.shade === item.shade
              ? { ...entry, quantity: entry.quantity + item.quantity }
              : entry,
          );
        });
      },
      removeFromCart: (slug) => {
        setCart((current) => current.filter((item) => item.slug !== slug));
      },
      updateQuantity: (slug, quantity) => {
        setCart((current) =>
          current.map((item) => (item.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item)),
        );
      },
      toggleWishlist: (slug) => {
        setWishlist((current) =>
          current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
        );
      },
      clearCart: () => setCart([]),
    }),
    [cart, query, wishlist],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }

  return context;
}

