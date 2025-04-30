"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar } from "lucide-react";

export function SearchForm() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to) {
      router.push(
        `/offers?from=${from}&to=${to}${date ? `&date=${date}` : ""}`
      );
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Trouvez votre prochain voyage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="from" className="text-sm font-medium">
                Départ
              </label>
              <div className="relative">
                <Input
                  id="from"
                  placeholder="PAR, NYC..."
                  value={from}
                  onChange={(e) => setFrom(e.target.value.toUpperCase())}
                  className="pl-10"
                  required
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="to" className="text-sm font-medium">
                Destination
              </label>
              <div className="relative">
                <Input
                  id="to"
                  placeholder="TYO, LON..."
                  value={to}
                  onChange={(e) => setTo(e.target.value.toUpperCase())}
                  className="pl-10"
                  required
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date (optionnel)
              </label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Rechercher
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
