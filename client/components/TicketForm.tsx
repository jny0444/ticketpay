"use client";

import { useState } from "react";
import { pinata } from "@/utils/config";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [cid, setCid] = useState<string | null>(null);


  const uploadFile = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setUploading(true);
      const urlRequest = await fetch("/api/url"); // Fetches the temporary upload URL
      const urlResponse = await urlRequest.json(); // Parse response
      console.log(urlResponse);
      const upload = await pinata.upload.file(file).url(urlResponse.url); // Upload the file with the signed URL

      setUrl(urlResponse.url); // Get the URL from the upload response
      setCid(upload.cid); // Get the CID from the upload response

      console.log(upload);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  };

  return (
    <div className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
      <input type="file" onChange={handleChange} />
      <button type="button" disabled={uploading} onClick={uploadFile}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      <a href={url ?? ""} target="_blank" rel="noopener noreferrer">
        {url ? "View File" : "No file uploaded yet"}
      </a>
      <p>{cid ? `CID: ${cid}` : "No CID available"}</p>
    </div>
  );
}
