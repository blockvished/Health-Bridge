// components/Footer.tsx
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t py-6 text-center relative">
      <div className="flex justify-center items-center space-x-2">
        <span className="text-gray-600">Powered by</span>
        <Image
          src="/logo_live_doctors.png"
          alt="Live Doctors Logo"
          width={100}
          height={32}
          className="h-auto"
        />
      </div>
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-full bg-blue-100 hover:bg-blue-200 p-3 transition-colors shadow-md"
        >
          <span className="text-blue-600 font-bold">↑</span>
        </button>
      </div>
    </footer>
  );
}