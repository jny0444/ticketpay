"use client";

import { ListPlus, Upload, Calendar, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";
import ReclaimDemo from "@/components/ReclaimProvider";

export default function List() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const acceptedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];

      if (acceptedImageTypes.includes(file.type)) {
        setFileName(file.name);

        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }
      } else {
        alert("Please upload an image file (jpg, png, gif, etc.)");
      }
    }
  };

  const handlePinata = (e) => {
    e.preventDefault();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white"
    >
      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-neutral-800 p-6 rounded-lg shadow-lg flex gap-10"
        >
          <div className="mb-4">
            <motion.div
              whileHover={{ scale: 1.01 }}
              animate={{
                borderColor: isDragging ? "#ffffff" : "#d1d5db",
                backgroundColor: fileName
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDragEnd={() => setIsDragging(false)}
              onDrop={handleDrop}
              className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed h-100 w-100 rounded-md cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center flex flex-col items-center justify-center">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: isDragging ? 10 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="flex flex-col text-sm text-neutral-600 items-center gap-2"
                >
                  <Upload
                    size={40}
                    className={`${isDragging ? "text-white" : "text-neutral-500"}`}
                  />
                  <span className="relative text-xl cursor-pointer bg-neutral-800 rounded-md font-medium text-neutral-400 hover:text-neutral-300">
                    {fileName ? fileName : "Drag image here or click to upload"}
                  </span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </motion.div>
                <p className="text-neutral-500 text-lg">
                  Images up to 10MB (JPG, PNG, GIF)
                </p>
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-5"
            >
              <label className="text-xl font-medium text-neutral-300 flex items-center gap-2">
                <Calendar size={18} />
                Event Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="event-name"
                type="text"
                className="mt-1 block w-100 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                placeholder="Chacha ki shaadi"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-14"
            >
              <label className="text-xl font-medium text-neutral-300 flex items-center gap-2">
                <Wallet size={18} />
                Reselling Price
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="reselling-price"
                type="text"
                className="mt-1 block w-100 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                placeholder="0.1 eth"
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 1 }}
              type="submit"
              className="w-full text-lg duration-200 flex items-center gap-1.5 justify-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-neutral-600 hover:bg-neutral-700"
            >
              <ListPlus />
              List
            </motion.button>
          </div>
        </motion.div>
      </form>

      {/* Modal with AnimatePresence for exit animations */}
      {/* <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/10 bg-opacity-60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-50"
            >
              <ReclaimDemo autoStart={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </motion.div>
  );
}
