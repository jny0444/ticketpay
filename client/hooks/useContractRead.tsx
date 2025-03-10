import { wagmiContractConfig } from "@/constants/wagmiConfig";
import { useReadContract } from "wagmi";

function getAllTickets(){
  const {data: tickets} = useReadContract({
    ...wagmiContractConfig,
    functionName:"getAllTickets",
    args:[]
  })
}