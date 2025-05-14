"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/url", {
        method: "POST",
        body: data,
      });

      if (!uploadRequest.ok) {
        const errorData = await uploadRequest.json();
        throw new Error(errorData.error || "Failed to upload");
      }

      const signedUrl = await uploadRequest.json();
      setUrl(signedUrl);
      setUploading(false);
    } catch (e) {
      console.error(e);
      setUploading(false);
      alert("Trouble uploading file to IPFS");
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
      {/* Add a conditional looking for the signed url and use it as the source */}
      {url && <img src={url} alt="Image from Pinata" />}
    </div>
  );
}
