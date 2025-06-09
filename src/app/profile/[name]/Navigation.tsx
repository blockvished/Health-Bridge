import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <Link href="/">
        <Image
          src="/logo_live_doctors.png"
          alt="Live Doctors Logo"
          width={120}
          height={40}
          className="h-auto"
        />
      </Link>
      <ul className="flex space-x-6 text-gray-700">
        <li>
          <Link href={pathname} className="hover:text-blue-500 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link
            href={`${pathname}/about`}
            className="hover:text-blue-500 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/"
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium"
          >
            Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
}