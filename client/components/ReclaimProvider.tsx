import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

function ReclaimDemo({ autoStart = false }) {
  // State to store the verification request URL
  const [requestUrl, setRequestUrl] = useState("");
  const [proofs, setProofs] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const getVerificationReq = async () => {
    // Set loading to true when verification starts
    setIsLoading(true);

    // Your credentials from the Reclaim Developer Portal
    // Replace these with your actual credentials

    const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
    const APP_SECRET = process.env.NEXT_PUBLIC_APP_SECRET;
    const PROVIDER_ID = process.env.NEXT_PUBLIC_PROVIDER_ID;

    // Initialize the Reclaim SDK with your credentials
    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID || "",
      APP_SECRET || "",
      PROVIDER_ID || ""
    );

    // Generate the verification request URL
    const requestUrl = await reclaimProofRequest.getRequestUrl();

    console.log("Request URL:", requestUrl);

    setRequestUrl(requestUrl);
    setIsLoading(false); // Set loading to false once we have the URL

    // Start listening for proof submissions
    await reclaimProofRequest.startSession({
      // Called when the user successfully completes the verification
      onSuccess: (proofs) => {
        console.log("Verification success", proofs);
        setProofs(proofs);

        // Add your success logic here, such as:
        // - Updating UI to show verification success
        // - Storing verification status
        // - Redirecting to another page
      },
      // Called if there's an error during verification
      onError: (error) => {
        console.error("Verification failed", error);

        // Add your error handling logic here, such as:
        // - Showing error message to user
        // - Resetting verification state
        // - Offering retry options
      },
    });
  };

  // Use effect to auto-start verification if prop is true
  useEffect(() => {
    if (autoStart) {
      getVerificationReq();
    }
  }, [autoStart]);

  return (
    <div className="bg-neutral-200 p-10 rounded-4xl text-xl flex flex-col justify-center items-center">
      {!autoStart && (
        <button
          onClick={getVerificationReq}
          className="bg-black text-white font-sans px-4 py-2 rounded-xl font-bold"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              Verifying{" "}
              <div className="w-4 h-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            "Verify"
          )}
        </button>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-black">Generating verification QR code...</p>
        </div>
      )}

      {requestUrl && (
        <>
          <p className="text-black">Scan this QR Code to verify</p>
          <div className="m-4 border-4 border-black p-3 rounded-xl">
            <QRCode value={requestUrl} />
          </div>
        </>
      )}
    </div>
  );
}

export default ReclaimDemo;
