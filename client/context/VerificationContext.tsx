"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { Proof } from "@reclaimprotocol/js-sdk";

type VerificationStatus = {
  isVerified: boolean;
  proofs: Array<Proof | string>;
  setVerificationStatus: (
    isVerified: boolean,
    proofs: Array<Proof | string>
  ) => void;
};

const defaultValue: VerificationStatus = {
  isVerified: false,
  proofs: [],
  setVerificationStatus: () => {},
};

const VerificationContext = createContext<VerificationStatus>(defaultValue);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [proofs, setProofs] = useState<Array<Proof | string>>([]);

  const setVerificationStatus = (
    isVerified: boolean,
    proofs: Array<Proof | string>
  ) => {
    setIsVerified(isVerified);
    setProofs(proofs);
  };

  return (
    <VerificationContext.Provider
      value={{
        isVerified,
        proofs,
        setVerificationStatus,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error(
      "useVerification must be used within a VerificationProvider"
    );
  }
  return context;
}
