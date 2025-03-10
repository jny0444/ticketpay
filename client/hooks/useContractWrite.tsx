import abi from "@/constants";
import { useWriteContract, useAccount } from "wagmi";

export function ListTicketForSale(metadataURI: string) {
    const { writeContract } = useWriteContract();

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    
        const formData = new FormData(e.target as HTMLFormElement);
        const price = formData.get("reselling-price") as string;
    
        writeContract({
          address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          abi: abi,
          functionName: "listTicket",
          args: [metadataURI, price],
        });
    }
}