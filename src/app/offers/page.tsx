"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OfferCard } from "@/components/offer-card";
import { Recommendations } from "@/components/recommendations";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Offer } from "@/lib/types";

export default function OffersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!from || !to) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/offers?from=${from}&to=${to}`);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des offres");
        }

        const data = await response.json();
        setOffers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [from, to]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {from && to ? `Vols de ${from} à ${to}` : "Rechercher des offres"}
        </h1>
        <Button
          onClick={() => router.push("/offers/new")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Nouvelle offre
        </Button>
      </div>

      <SearchForm />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2">Chargement des offres...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              <p>{error}</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
              <p>Aucune offre trouvée pour cette recherche.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">{offers.length} offres trouvées</p>
              <div className="grid grid-cols-1 gap-4">
                {offers.map((offer) => (
                  <OfferCard key={offer._id} offer={offer} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div>{from && <Recommendations city={from} />}</div>
      </div>
    </div>
  );
}
