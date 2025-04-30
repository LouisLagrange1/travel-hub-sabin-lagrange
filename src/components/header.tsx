import Link from "next/link";
import { Plane, Plus } from "lucide-react";

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
            <li>
              <Link
                href="/offers/new"
                className="flex items-center hover:underline"
              >
                <Plus className="h-4 w-4 mr-1" /> Nouvelle offre
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
