"use client";

import {
  ListPlus,
  Upload,
  Calendar,
  Wallet,
  Clock,
  Ticket,
} from "lucide-react";
import { useState, useRef } from "react";
import abi from "@/constants";
import { useWriteContract } from "wagmi";

const PINATA_API_KEY = "02a1f4eed8bcadfe1f4c";
const PINATA_SECRET_API_KEY =
  "5f34f3181f286daa49c5d8a7be025aa6d3c4dc8b46dae65b9f018166306b38c7";

const uploadMetadataToPinata = async (
  imageCID: string,
  eventDate: string = "No date specified",
  eventTime: string = "No time specified"
) => {
  const metadata = {
    name: "NFT Ticket",
    description: "Exclusive Event Ticket",
    image: `ipfs://${imageCID}`,
    attributes: [
      { trait_type: "EventDate", value: eventDate },
      { trait_type: "EventTime", value: eventTime },
    ],
  };

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
      body: JSON.stringify(metadata),
    }
  );

  const result = await response.json();
  return `ipfs://${result.IpfsHash}`;
};

export default function List() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageURI, setImageURI] = useState("");
  const [metadataURI, setMetadataURI] = useState("");

  const uploadToPinata = async (
    fileToUpload: File,
    eventDate: string,
    eventTime: string
  ) => {
    if (!fileToUpload) {
      throw new Error("No file selected");
    }

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
          body: formData,
        }
      );

      const result = await response.json();
      const imageCid = result.IpfsHash;
      const metadataLink = await uploadMetadataToPinata(
        imageCid,
        eventDate,
        eventTime
      );
      setImageURI(`ipfs://${imageCid}`);
      setMetadataURI(metadataLink);

      console.log("Image uploaded to IPFS:", `ipfs://${imageCid}`);
      console.log("Metadata uploaded to IPFS:", metadataLink);

      return metadataLink;
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      throw error;
    }
  };

  const { writeContract } = useWriteContract();

  const handleSubmit = (e: React.FormEvent) => {
    const file = new FormData(e.currentTarget as HTMLFormElement);
    const eventDate = file.get("event-date") as string;
    const eventTime = file.get("event-time") as string;
    const resellingPrice = file.get("resellin-price") as string;

    const metadata = uploadToPinata(
      fileInputRef.current.files[0],
      eventDate,
      eventTime
    );

    writeContract({
      address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`,
      abi: abi,
      functionName: "listTicket",
      args: [metadata, resellingPrice],
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <form onSubmit={handleSubmit}>
        <div className="bg-neutral-800 p-6 rounded-lg shadow-lg flex gap-10">
          <div className="">
            <div>
              <div className="space-y-1 text-center flex flex-col items-center justify-center">
                <div className="flex flex-col text-sm text-neutral-600 items-center gap-2">
                  <Upload
                    size={40}
                    className={`${
                      isDragging ? "text-white" : "text-neutral-500"
                    }`}
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
                  />
                </div>
                <p className="text-neutral-500 text-lg">
                  Images up to 10MB (JPG, PNG, GIF)
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-3">
              <label className="text-xl font-medium text-neutral-300 flex items-center gap-2">
                <Ticket size={18} />
                Event Name
              </label>
              <input
                name="event-name"
                type="text"
                className="mt-1 block w-100 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                placeholder="Chacha ki shaadi"
              />
            </div>
            <div className="mb-3">
              <label className="text-xl font-medium text-neutral-300 flex items-center gap-2">
                <Calendar size={18} />
                Event Date
              </label>
              <input
                name="event-date"
                type="date"
                className="mt-1 block w-100 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm text-white"
              />
            </div>

            <div className="mb-3">
              <label className="text-xl font-medium text-neutral-300 flex items-center gap-2">
                <Clock size={18} />
                Event Time
              </label>
              <input
                name="event-time"
                type="time"
                className="mt-1 block w-100 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm text-white"
              />
            </div>

            <div className="mb-10">
              <label className="text-xl font-medium text-neutral-300 flex items-center gap-2">
                <Wallet size={18} />
                Reselling Price
              </label>
              <input
                name="reselling-price"
                type="number"
                step={0.01}
                className="mt-1 block w-100 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                placeholder="0.1 eth"
              />
            </div>
            <button
              type="submit"
              className="w-full text-lg duration-200 flex items-center gap-1.5 justify-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-neutral-600 hover:bg-neutral-700"
            >
              <ListPlus />
              List
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
