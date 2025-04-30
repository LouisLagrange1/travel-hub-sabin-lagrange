"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recommendations } from "@/components/recommendations";
import {
  ArrowLeft,
  Plane,
  Hotel,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  User,
} from "lucide-react";
import { Offer } from "@/lib/types";

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/offers/${id}`);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'offre");
        }

        const data = await response.json();
        setOffer(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2">Chargement de l'offre...</p>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p>{error || "Offre introuvable"}</p>
        </div>
      </div>
    );
  }

  const totalPrice =
    offer.price + (offer.hotel?.price || 0) + (offer.activity?.price || 0);
  const departDate = offer.departDate
    ? new Date(offer.departDate).toLocaleDateString()
    : "";
  const returnDate = offer.returnDate
    ? new Date(offer.returnDate).toLocaleDateString()
    : "";

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {offer.from} → {offer.to}
                  </CardTitle>
                  <div className="flex items-center mt-1 text-gray-600">
                    <User className="h-4 w-4 mr-1" />
                    <span className="font-medium">{offer.provider}</span>
                  </div>
                  {departDate && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {departDate} - {returnDate}
                    </p>
                  )}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalPrice} {offer.currency}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {offer.legs && offer.legs.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Plane className="h-5 w-5 mr-2 text-blue-500" /> Vol
                  </h3>
                  {offer.legs.map((leg, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Vol {leg.flightNum}</p>
                          <div className="flex items-center text-gray-600 mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Durée: {leg.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium">
                            {leg.dep} → {leg.arr}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {offer.hotel && offer.hotel.name && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Hotel className="h-5 w-5 mr-2 text-blue-500" /> Hébergement
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{offer.hotel.name}</p>
                        <p className="text-gray-600 mt-1">
                          {offer.hotel.nights} nuits
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium">
                          {offer.hotel.price} {offer.currency}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {offer.activity && offer.activity.title && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500" /> Activité
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{offer.activity.title}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium">
                          {offer.activity.price} {offer.currency}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Total</h3>
                  <div className="text-xl font-bold text-blue-600">
                    {totalPrice} {offer.currency}
                  </div>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                <CreditCard className="h-4 w-4 mr-2" /> Réserver maintenant
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Recommendations city={offer.from} />

          {offer.relatedOffers && offer.relatedOffers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Autres destinations populaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {offer.relatedOffers.map((city, index) => (
                    <li key={index}>
                      <a
                        href={`/offers?from=${offer.from}&to=${city}`}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                      >
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{city}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
