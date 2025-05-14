import ReclaimQR from "@/components/ReclaimQR";
import TicketForm from "@/components/TicketForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Ticket Verification
        </h1>
        <ReclaimQR />
        <div className="mt-8">
          <TicketForm />
        </div>
      </div>
    </div>
  );
}
