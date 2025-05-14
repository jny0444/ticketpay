"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { ReclaimProofRequest, type Proof } from "@reclaimprotocol/js-sdk";

export default function ReclaimQR() {
  const [requestUrl, setRequestUrl] = useState("");
  const [proofs, setProofs] = useState<Array<Proof | string>>([]);

  const getVerificationReq = async () => {
    const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
    const APP_SECRET = process.env.NEXT_PUBLIC_APP_SECRET;
    const PROVIDER_ID = process.env.NEXT_PUBLIC_PROVIDER_ID;

    const reclaimProofRequest = await ReclaimProofRequest.init(
      APP_ID,
      APP_SECRET,
      PROVIDER_ID
    );

    const requestUrl = await reclaimProofRequest.getRequestUrl();
    setRequestUrl(requestUrl);

    await reclaimProofRequest.startSession({
      onSuccess: (proofs) => {
        if (proofs) {
          if (typeof proofs === "string") {
            console.log("SDK Message:", proofs);
            setProofs([proofs]);
          } else if (typeof proofs !== "string") {
            if (Array.isArray(proofs)) {
              console.log(
                "Verification success",
                JSON.stringify(proofs.map((p) => p.claimData.context))
              );
              setProofs(proofs);
            } else {
              console.log("Verification success", proofs?.claimData.context);
              setProofs([proofs]);
            }
          }
        }
        // Add your success logic here, such as:
        // - Updating UI to show verification success
        // - Storing verification status
        // - Redirecting to another page
      },
      onError: (error) => {
        console.error("Verification failed", error);

        // Add your error handling logic here, such as:
        // - Showing error message to user
        // - Resetting verification state
        // - Offering retry options
      },
    });
  };

  return (
    <>
      <button onClick={getVerificationReq}>Get Verification Request</button>
      {/* Display QR code when URL is available */}
      {requestUrl && (
        <div style={{ margin: "20px 0" }}>
          <QRCode value={requestUrl} />
        </div>
      )}
      {proofs && (
        <div>
          <h2>Verification Successful!</h2>
          <pre>{JSON.stringify(proofs, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
