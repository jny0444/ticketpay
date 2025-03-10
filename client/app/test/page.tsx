"use client";

import { useState } from "react";

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

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageURI, setImageURI] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [uploading, setUploading] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  const uploadToPinata = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

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
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-white py-96">
      <div className="flex gap-2 items-center mb-2">
        <label htmlFor="eventDate">Event Date: </label>
        <input
          id="eventDate"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="text-black p-1 mr-2"
        />
        <label htmlFor="eventTime">Event Time: </label>
        <input
          id="eventTime"
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          className="text-black p-1"
        />
      </div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="my-2"
      />
      <button
        onClick={uploadToPinata}
        disabled={uploading}
        className="bg-blue-600 px-4 py-2 rounded ml-2"
      >
        {uploading ? "Uploading..." : "Upload Image to IPFS"}
      </button>
      {imageURI && (
        <p>
          IPFS Link:{" "}
          <a
            href={`https://gateway.pinata.cloud/ipfs/${
              imageURI.split("ipfs://")[1]
            }`}
            target="_blank"
            className="text-blue-400 underline"
          >
            {imageURI}
          </a>
        </p>
      )}
      {metadataURI && (
        <p>
          Metadata IPFS Link:{" "}
          <a
            href={`https://gateway.pinata.cloud/ipfs/${
              metadataURI.split("ipfs://")[1]
            }`}
            target="_blank"
            className="text-blue-400 underline"
          >
            {metadataURI}
          </a>
        </p>
      )}
    </div>
  );
}
