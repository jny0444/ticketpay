"use client";

import { useShoppingBag } from "@/contexts/ShoppingBagContext";
import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

export default function Checkout() {
  const { items, getTotalPrice, clearBag } = useShoppingBag();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = async () => {
    // Here you would integrate with the smart contract to place the order
    // For now, let's simulate a completed order
    setTimeout(() => {
      setOrderPlaced(true);
      clearBag();
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-6"
      >
        <div className="max-w-3xl mx-auto bg-neutral-900 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-green-400">
            Order Complete!
          </h1>
          <p className="text-xl mb-6">
            Your tickets will be available in your wallet shortly.
          </p>
          <Link href="/buy">
            <button className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-md transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-400 mb-6">Your bag is empty</p>
            <Link href="/buy">
              <button className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-md transition-colors">
                Browse Tickets
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-neutral-900 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-4 border-b border-neutral-800"
                >
                  <div>
                    <h3 className="font-medium">{item.eventName}</h3>
                    <p className="text-sm text-neutral-400">{item.date}</p>
                    <p className="text-sm text-neutral-400">{item.location}</p>
                  </div>
                  <p className="font-bold">{item.price}</p>
                </div>
              ))}
            </div>

            <div className="bg-neutral-900 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-bold mb-4">Payment</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>{getTotalPrice().toFixed(2)} ETH</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-neutral-800">
                  <span>Total</span>
                  <span>{getTotalPrice().toFixed(2)} ETH</span>
                </div>
              </div>

              <motion.button
                onClick={handlePlaceOrder}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-md transition-colors mt-4"
              >
                Place Order
              </motion.button>

              <p className="text-xs text-neutral-400 mt-4 text-center">
                By placing your order, you agree to connect your wallet and pay{" "}
                {getTotalPrice().toFixed(2)} ETH.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
