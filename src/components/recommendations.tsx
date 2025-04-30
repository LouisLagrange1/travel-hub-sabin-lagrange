"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface Recommendation {
  city: string;
}

export function Recommendations({ city }: { city: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reco?city=${city}`);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des recommandations");
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchRecommendations();
    }
  }, [city]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Destinations similaires</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement des recommandations...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Destinations similaires</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Destinations similaires à {city}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((reco, index) => (
            <li key={index}>
              <Link
                href={`/offers?from=${city}&to=${reco.city}`}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
              >
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{reco.city}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
