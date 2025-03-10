import { Unlink2 } from "lucide-react";

export default function Navbar() {
  return (
    <>
      <div className="fixed bg-black text-white text-xl top-3 z-50 rounded-2xl flex justify-between items-center px-6 py-3">
        <div className="font-sans">Menu</div>
        <div className="font-serif text-4xl">TicketPay</div>
        <div className="font-sans">(0) Bag</div>
      </div>
      <div className="fixed right-5 top-3 bg-black">
        <Unlink2 className="text-white" />
      </div>
    </>
  );
}
