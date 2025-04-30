"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane, Hotel, MapPin, Plus, Minus } from "lucide-react";

export function AddOfferForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    provider: "",
    price: "",
    currency: "EUR",
    legs: [{ flightNum: "", dep: "", arr: "", duration: "" }],
    hotel: { name: "", nights: "1", price: "" },
    activity: { title: "", price: "" },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("legs[")) {
      const match = name.match(/legs\[(\d+)\]\.(.+)/);
      if (match) {
        const index = Number.parseInt(match[1]);
        const field = match[2];
        const newLegs = [...formData.legs];
        newLegs[index] = { ...newLegs[index], [field]: value };
        setFormData({ ...formData, legs: newLegs });
      }
    } else if (name.startsWith("hotel.")) {
      const field = name.replace("hotel.", "");
      setFormData({
        ...formData,
        hotel: { ...formData.hotel, [field]: value },
      });
    } else if (name.startsWith("activity.")) {
      const field = name.replace("activity.", "");
      setFormData({
        ...formData,
        activity: { ...formData.activity, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addLeg = () => {
    setFormData({
      ...formData,
      legs: [
        ...formData.legs,
        { flightNum: "", dep: "", arr: "", duration: "" },
      ],
    });
  };

  const removeLeg = (index: number) => {
    const newLegs = [...formData.legs];
    newLegs.splice(index, 1);
    setFormData({ ...formData, legs: newLegs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation
      if (
        !formData.from ||
        !formData.to ||
        !formData.departDate ||
        !formData.returnDate ||
        !formData.provider ||
        !formData.price
      ) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      // Préparer les données
      const offerData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        legs: formData.legs.filter(
          (leg) => leg.flightNum && leg.dep && leg.arr
        ),
        hotel: formData.hotel.name
          ? {
              ...formData.hotel,
              nights: Number.parseInt(formData.hotel.nights),
              price: Number.parseFloat(formData.hotel.price),
            }
          : undefined,
        activity:
          formData.activity.title && formData.activity.price
            ? {
                ...formData.activity,
                price: Number.parseFloat(formData.activity.price),
              }
            : undefined,
      };

      // Envoyer les données
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la création de l'offre"
        );
      }

      const result = await response.json();
      setSuccess(`Offre créée avec succès! ID: ${result.id}`);

      // Réinitialiser le formulaire
      setFormData({
        from: "",
        to: "",
        departDate: "",
        returnDate: "",
        provider: "",
        price: "",
        currency: "EUR",
        legs: [{ flightNum: "", dep: "", arr: "", duration: "" }],
        hotel: { name: "", nights: "1", price: "" },
        activity: { title: "", price: "" },
      });

      // Rediriger vers la page de détail après 2 secondes
      setTimeout(() => {
        router.push(`/offers/${result.id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ajouter une nouvelle offre</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4">
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Plane className="h-5 w-5 mr-2 text-blue-500" /> Informations de
              vol
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="from" className="text-sm font-medium">
                  Départ *
                </label>
                <Input
                  id="from"
                  name="from"
                  placeholder="PAR, NYC..."
                  value={formData.from}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="to" className="text-sm font-medium">
                  Destination *
                </label>
                <Input
                  id="to"
                  name="to"
                  placeholder="TYO, LON..."
                  value={formData.to}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="departDate" className="text-sm font-medium">
                  Date de départ *
                </label>
                <Input
                  id="departDate"
                  name="departDate"
                  type="date"
                  value={formData.departDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="returnDate" className="text-sm font-medium">
                  Date de retour *
                </label>
                <Input
                  id="returnDate"
                  name="returnDate"
                  type="date"
                  value={formData.returnDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="provider" className="text-sm font-medium">
                  Compagnie *
                </label>
                <Input
                  id="provider"
                  name="provider"
                  placeholder="Air France, Lufthansa..."
                  value={formData.provider}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Prix *
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="450.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="currency" className="text-sm font-medium">
                  Devise *
                </label>
                <Input
                  id="currency"
                  name="currency"
                  placeholder="EUR, USD..."
                  value={formData.currency}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                <Plane className="h-5 w-5 mr-2 text-blue-500" /> Segments de vol
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLeg}
              >
                <Plus className="h-4 w-4 mr-1" /> Ajouter un segment
              </Button>
            </div>

            {formData.legs.map((leg, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Segment {index + 1}</h4>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLeg(index)}
                      className="text-red-500"
                    >
                      <Minus className="h-4 w-4 mr-1" /> Supprimer
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor={`legs[${index}].flightNum`}
                      className="text-sm font-medium"
                    >
                      Numéro de vol
                    </label>
                    <Input
                      id={`legs[${index}].flightNum`}
                      name={`legs[${index}].flightNum`}
                      placeholder="AF123"
                      value={leg.flightNum}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`legs[${index}].duration`}
                      className="text-sm font-medium"
                    >
                      Durée
                    </label>
                    <Input
                      id={`legs[${index}].duration`}
                      name={`legs[${index}].duration`}
                      placeholder="2h30"
                      value={leg.duration}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor={`legs[${index}].dep`}
                      className="text-sm font-medium"
                    >
                      Aéroport de départ
                    </label>
                    <Input
                      id={`legs[${index}].dep`}
                      name={`legs[${index}].dep`}
                      placeholder="PAR"
                      value={leg.dep}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`legs[${index}].arr`}
                      className="text-sm font-medium"
                    >
                      Aéroport d'arrivée
                    </label>
                    <Input
                      id={`legs[${index}].arr`}
                      name={`legs[${index}].arr`}
                      placeholder="TYO"
                      value={leg.arr}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Hotel className="h-5 w-5 mr-2 text-blue-500" /> Hébergement
              (optionnel)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="hotel.name" className="text-sm font-medium">
                  Nom de l'hôtel
                </label>
                <Input
                  id="hotel.name"
                  name="hotel.name"
                  placeholder="Grand Hôtel"
                  value={formData.hotel.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="hotel.nights" className="text-sm font-medium">
                  Nombre de nuits
                </label>
                <Input
                  id="hotel.nights"
                  name="hotel.nights"
                  type="number"
                  min="1"
                  value={formData.hotel.nights}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="hotel.price" className="text-sm font-medium">
                Prix de l'hébergement
              </label>
              <Input
                id="hotel.price"
                name="hotel.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="200.00"
                value={formData.hotel.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-500" /> Activité
              (optionnel)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="activity.title" className="text-sm font-medium">
                  Titre de l'activité
                </label>
                <Input
                  id="activity.title"
                  name="activity.title"
                  placeholder="Visite guidée"
                  value={formData.activity.title}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="activity.price" className="text-sm font-medium">
                  Prix de l'activité
                </label>
                <Input
                  id="activity.price"
                  name="activity.price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="50.00"
                  value={formData.activity.price}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Création en cours..." : "Créer l'offre"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
