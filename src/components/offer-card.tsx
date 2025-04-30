import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, MapPin } from "lucide-react";

interface OfferCardProps {
  id: string;
  from: string;
  to: string;
  price: number;
  currency?: string;
  legs?: Array<{
    flightNum: string;
    dep: string;
    arr: string;
    duration: string;
  }>;
  hotel?: {
    name: string;
    nights: number;
    price: number;
  };
  activity?: {
    title: string;
    price: number;
  };
}

export function OfferCard({
  id,
  from,
  to,
  price,
  currency = "EUR",
  legs,
  hotel,
  activity,
}: OfferCardProps) {
  const totalPrice = price + (hotel?.price || 0) + (activity?.price || 0);

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {from} → {to}
          </CardTitle>
          <div className="text-xl font-bold text-blue-600">
            {totalPrice} {currency}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {legs && legs.length > 0 && (
            <div className="flex items-start space-x-2">
              <Plane className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Vol {legs[0].flightNum}</p>
                <p className="text-sm text-gray-600">
                  Durée: {legs[0].duration}
                </p>
              </div>
            </div>
          )}

          {hotel && (
            <div className="flex items-start space-x-2">
              <Hotel className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">{hotel.name}</p>
                <p className="text-sm text-gray-600">
                  {hotel.nights} nuits • {hotel.price} {currency}
                </p>
              </div>
            </div>
          )}

          {activity && (
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-600">
                  {activity.price} {currency}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/offers/${id}`} className="w-full">
          <Button variant="outline" className="w-full">
            Voir les détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
