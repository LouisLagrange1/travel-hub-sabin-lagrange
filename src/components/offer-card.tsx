import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, MapPin, Calendar } from "lucide-react";
import { Offer } from "@/lib/types";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const totalPrice =
    offer.price + (offer.hotel?.price || 0) + (offer.activity?.price || 0);

  // Formatage des dates
  const departDate = offer.departDate
    ? new Date(offer.departDate).toLocaleDateString()
    : "";
  const returnDate = offer.returnDate
    ? new Date(offer.returnDate).toLocaleDateString()
    : "";

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {offer.from} → {offer.to}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">{offer.provider}</span>
              {departDate && (
                <span className="ml-2 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {departDate} - {returnDate}
                </span>
              )}
            </p>
          </div>
          <div className="text-xl font-bold text-blue-600">
            {totalPrice} {offer.currency}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {offer.legs && offer.legs.length > 0 && (
            <div className="flex items-start space-x-2">
              <Plane className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Vol {offer.legs[0].flightNum}</p>
                <p className="text-sm text-gray-600">
                  Durée: {offer.legs[0].duration}
                </p>
              </div>
            </div>
          )}

          {offer.hotel && offer.hotel.name && (
            <div className="flex items-start space-x-2">
              <Hotel className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">{offer.hotel.name}</p>
                <p className="text-sm text-gray-600">
                  {offer.hotel.nights} nuits • {offer.hotel.price}{" "}
                  {offer.currency}
                </p>
              </div>
            </div>
          )}

          {offer.activity && offer.activity.title && (
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">{offer.activity.title}</p>
                <p className="text-sm text-gray-600">
                  {offer.activity.price} {offer.currency}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/offers/${offer._id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Voir les détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
