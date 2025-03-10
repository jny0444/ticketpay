import { useShoppingBag } from "@/contexts/ShoppingBagContext";
import { motion } from "motion/react";
import Image from "next/image";
import { Ticket } from "lucide-react";

interface TicketCardProps {
  id: number; // Add id to props
  eventName: string;
  date: string;
  price: string;
  location: string;
  imageUrl?: string;
  index?: number;
}

const TicketCard = ({
  id,
  eventName,
  date,
  price,
  location,
  imageUrl,
  index = 0,
}: TicketCardProps) => {
  const { addItem } = useShoppingBag();

  const handleAddToBag = () => {
    // Extract numeric price value for calculations
    const priceValue = parseFloat(price.replace(" ETH", ""));

    addItem({
      id,
      eventName,
      date,
      price,
      location,
      imageUrl,
      priceValue,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="bg-neutral-800 rounded-lg overflow-hidden w-72 shadow-lg transition-shadow duration-300"
    >
      <div className="h-40 relative bg-neutral-700">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={eventName}
            layout="fill"
            objectFit="cover"
            className="opacity-90"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Ticket size={60} className="text-neutral-500" />
            </motion.div>
          </div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4"
      >
        <h3 className="text-xl font-bold text-white mb-2">{eventName}</h3>
        <div className="text-neutral-300 text-sm mb-2">{date}</div>
        <div className="text-neutral-300 text-sm mb-3">{location}</div>
        <div className="p-4 flex justify-between items-center mt-2">
          <div className="flex-1">
            <p className="text-lg font-bold text-green-400">{price}</p>
          </div>
          <motion.button
            onClick={handleAddToBag}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
          >
            Add to Bag
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TicketCard;
