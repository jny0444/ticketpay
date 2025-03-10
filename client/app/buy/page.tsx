"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import TicketCard from "@/components/TicketCard";
import { motion, AnimatePresence } from "motion/react";

// Mock data for tickets
const mockTickets = [
  {
    id: 1,
    eventName: "Concert in the Park",
    date: "June 15, 2023 • 8:00 PM",
    price: "0.05 ETH",
    location: "Central Park, New York",
    imageUrl: "/images/concert.jpg", // You'd need to add these images or remove this prop
  },
  {
    id: 2,
    eventName: "Tech Conference 2023",
    date: "July 10, 2023 • 9:00 AM",
    price: "0.08 ETH",
    location: "Convention Center, San Francisco",
  },
  {
    id: 3,
    eventName: "Comedy Night Special",
    date: "June 20, 2023 • 7:30 PM",
    price: "0.03 ETH",
    location: "Laugh Factory, Los Angeles",
  },
  {
    id: 4,
    eventName: "Basketball Championship",
    date: "June 25, 2023 • 6:00 PM",
    price: "0.12 ETH",
    location: "Sports Arena, Chicago",
  },
];

export default function Buy() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(0.15); // Default max price for slider

  // Filter tickets based on search query and price range
  const filteredTickets = mockTickets.filter((ticket) => {
    // Extract numeric price from string (assuming format "0.XX ETH")
    const priceValue = parseFloat(ticket.price.replace(" ETH", ""));

    return (
      (ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
      priceValue <= priceRange
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-neutral-950 text-white pt-30 pb-12 px-6"
    >
      <div className="max-w-6xl mx-auto mb-8">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          {/* Search Input */}
          <motion.div whileHover={{ scale: 1.01 }} className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-neutral-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-600"
              placeholder="Search events, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md hover:bg-neutral-700 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </motion.button>
        </motion.div>

        {/* Filter Options (Hidden by default) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-neutral-800 p-4 rounded-md mb-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="col-span-1 md:col-span-3"
                >
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Price Range: {priceRange.toFixed(2)} ETH
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400">0</span>
                    <motion.input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={priceRange}
                      onChange={(e) =>
                        setPriceRange(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #b2b2a8 0%, #b2b2a8 ${(priceRange / 1) * 100}%, #fff ${(priceRange / 1) * 100}%, #fff 100%)`,
                      }}
                    />
                    <span className="text-xs text-neutral-400">1</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Date
                  </label>
                  <select className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2">
                    <option>Any Date</option>
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Event Type
                  </label>
                  <select className="w-full bg-neutral-700 border border-neutral-600 rounded-md p-2">
                    <option>All Events</option>
                    <option>Concerts</option>
                    <option>Sports</option>
                    <option>Conferences</option>
                  </select>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ticket Cards */}
      <motion.div layout className="flex flex-wrap gap-6 justify-center">
        <AnimatePresence>
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => (
              <TicketCard
                key={ticket.id}
                id={ticket.id} // Make sure to pass the ID
                eventName={ticket.eventName}
                date={ticket.date}
                price={ticket.price}
                location={ticket.location}
                imageUrl={ticket.imageUrl}
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-xl text-neutral-400">
                No tickets found matching your search
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
