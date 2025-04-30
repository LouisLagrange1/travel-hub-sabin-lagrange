import { AddOfferForm } from "@/components/add-offer-form";

export default function NewOfferPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Créer une nouvelle offre</h1>
      <AddOfferForm />
    </div>
  );
}
