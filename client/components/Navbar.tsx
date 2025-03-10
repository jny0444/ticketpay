"use client";

import {
  ListPlus,
  EllipsisVertical,
  Unlink2,
  Link2,
  Tickets,
  CircleDollarSign,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useShoppingBag } from "@/contexts/ShoppingBagContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const bagRef = useRef<HTMLDivElement>(null);

  const { isConnected, connectWallet, disconnect, address } = useWallet();
  const { items, itemCount, removeItem, getTotalPrice } = useShoppingBag();

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (bagRef.current && !bagRef.current.contains(event.target as Node)) {
        setBagOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Close bag menu if it's open
    if (bagOpen) {
      setBagOpen(false);
    }
    setMenuOpen(!menuOpen);
  };

  const toggleBag = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Close main menu if it's open
    if (menuOpen) {
      setMenuOpen(false);
    }
    setBagOpen(!bagOpen);
  };

  return (
    <>
      <div
        className={`fixed bg-white text-black text-xl top-3 left-1/2 -translate-x-1/2 w-180 z-50 ${bagOpen ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"} ${menuOpen ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"} flex justify-between items-center px-6 py-3 duration-400`}
      >
        <motion.div
          ref={menuRef}
          className="font-sans cursor-pointer relative"
          onClick={toggleMenu}
        >
          <motion.p
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 1 }}
            transition={{ duration: 0.05 }}
            className="hover:bg-neutral-100 px-2 py-1 rounded-lg flex items-center font-bold"
          >
            <EllipsisVertical size={20} />
            Menu
          </motion.p>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="absolute top-full -left-6 bg-neutral-100 rounded-b-xl rounded-t-none py-5 w-180 flex flex-col justify-center items-center gap-1 border-t-2 border-neutral-300"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 120 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ marginTop: 12 }}
              >
                <Link href="/list" onClick={handleLinkClick}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.05 }}
                    className="cursor-pointer hover:bg-neutral-200 duration-300 px-6 py-2 rounded-xl transition-colors flex gap-2 items-center font-bold"
                  >
                    <ListPlus />
                    List
                  </motion.div>
                </Link>
                <Link href="/buy" onClick={handleLinkClick}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.05 }}
                    className="cursor-pointer hover:bg-neutral-200 duration-300 px-6 py-2 rounded-xl transition-colors flex gap-2 items-center font-bold"
                  >
                    <CircleDollarSign />
                    Buy
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <Link
          href={"/"}
          className="font-serif text-4xl relative hover:underline"
        >
          TicketPay
          <Tickets
            className="absolute inset-0 opacity-10 left-12 -top-4"
            size={70}
          />
        </Link>
        <div className="relative" ref={bagRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 1 }}
            transition={{ duration: 0.05 }}
            className="hover:bg-neutral-100 px-2 py-1 rounded-lg flex items-center gap-2 font-bold cursor-pointer"
            onClick={toggleBag}
          >
            Bag
            <ShoppingBag className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-green-500 text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                {itemCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {bagOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ marginTop: 12 }}
                className="absolute top-full -right-6 bg-neutral-100 rounded-b-xl rounded-t-none py-5 w-180 flex flex-col justify-center items-center gap-1 border-t-2 border-neutral-300"
              >
                <div className="p-1 w-100">
                  {items.length === 0 ? (
                    <p className="text-neutral-400 text-center">
                      Your bag is empty
                    </p>
                  ) : (
                    <>
                      <div className="max-h-64 overflow-y-auto">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center gap-10 py-2 border-b border-neutral-700"
                          >
                            <div>
                              <p className="font-medium">{item.eventName}</p>
                              <p className="text-sm text-neutral-400">
                                {item.price}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-400 text-sm hover:text-red-300 cursor-pointer"
                            >
                              <Trash2 />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          <span>Total:</span>
                          <span className="font-bold">
                            {getTotalPrice().toFixed(2)} ETH
                          </span>
                        </div>

                        <Link href="/checkout">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded-md transition-colors text-white cursor-pointer"
                            onClick={() => setBagOpen(false)}
                          >
                            Checkout
                          </motion.button>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {isConnected ? (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className="fixed right-5 top-5 bg-white text-black px-4 py-2 rounded-2xl z-50 flex gap-2 items-center font-sans text-lg font-bold cursor-pointer"
          onClick={() => disconnect()}
        >
          {`${address.slice(0, 5)}...${address.slice(-3)}`} <Link2 size={30} />
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className="fixed right-5 top-5 bg-white text-black px-4 py-2 rounded-2xl z-50 flex gap-2 items-center font-sans text-lg font-bold cursor-pointer"
          onClick={() => connectWallet()}
        >
          Connect <Unlink2 size={30} />
        </motion.div>
      )}
    </>
  );
}
