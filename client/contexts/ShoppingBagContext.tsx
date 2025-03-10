"use client";

import React, { createContext, useContext, useState } from "react";

export type TicketItem = {
  id: number;
  eventName: string;
  date: string;
  price: string;
  location: string;
  imageUrl?: string;
  priceValue: number; // Actual numeric price
};

type ShoppingBagContextType = {
  items: TicketItem[];
  addItem: (item: TicketItem) => void;
  removeItem: (id: number) => void;
  clearBag: () => void;
  getTotalPrice: () => number;
  itemCount: number;
};

const ShoppingBagContext = createContext<ShoppingBagContextType | undefined>(
  undefined
);

export function ShoppingBagProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<TicketItem[]>([]);

  const addItem = (item: TicketItem) => {
    // Check if item already exists
    if (!items.some((existingItem) => existingItem.id === item.id)) {
      setItems((prevItems) => [...prevItems, item]);
    }
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearBag = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.priceValue, 0);
  };

  return (
    <ShoppingBagContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearBag,
        getTotalPrice,
        itemCount: items.length,
      }}
    >
      {children}
    </ShoppingBagContext.Provider>
  );
}

export function useShoppingBag() {
  const context = useContext(ShoppingBagContext);
  if (context === undefined) {
    throw new Error("useShoppingBag must be used within a ShoppingBagProvider");
  }
  return context;
}
