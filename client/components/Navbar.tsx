"use client";

import {
  ListPlus,
  EllipsisVertical,
  Ticket,
  Unlink2,
  ShoppingBag,
  Link2,
  Tickets,
  CircleDollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { isConnected, connectWallet, disconnect, address } = useWallet();

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div
        className={`fixed bg-white text-black text-xl top-3 left-1/2 -translate-x-1/2 w-180 z-50 ${menuOpen ? "rounded-t-2xl rounded-b-none" : "rounded-2xl"} flex justify-between items-center px-6 py-3 duration-400`}
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
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 1 }}
          transition={{ duration: 0.05 }}
          className="hover:bg-neutral-100 px-2 py-1 rounded-lg flex items-center gap-1 font-bold cursor-pointer"
        >
          <ShoppingBag size={20} />
          Bag (0)
        </motion.div>
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
