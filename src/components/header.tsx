import Link from "next/link";
import { Plane } from "lucide-react";

export function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xl font-bold"
        >
          <Plane className="h-6 w-6" />
          <span>TravelHub</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:underline">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/offers" className="hover:underline">
                Offres
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
