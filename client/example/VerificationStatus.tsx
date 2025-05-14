"use client";

import { useVerification } from "@/context/VerificationContext";

export default function VerificationStatus() {
  const { isVerified, proofs } = useVerification();

  return (
    <div>
      <h2>Verification Status</h2>
      <p>Status: {isVerified ? "Verified ✅" : "Not Verified ❌"}</p>
      {isVerified && proofs.length > 0 && (
        <div>
          <p>Proof Information:</p>
          <pre>{JSON.stringify(proofs, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
