#!/bin/sh

# Ajouter une session utilisateur
redis-cli SET session:1234abcd "u42" EX 900

# Ajouter une offre simplifiée
redis-cli SET offers:PAR:TYO '[{"id":"644c3b5e4c1a4f6d2d8e9b2c","provider":"AirZen","price":750.00,"currency":"EUR","legs":[{"flightNum":"AZ123","dep":"PAR","arr":"TYO","duration":"12h"}]}]' EX 60

# Ajouter les détails de l’offre
redis-cli SET offers:644c3b5e4c1a4f6d2d8e9b2c '{
  "id":"644c3b5e4c1a4f6d2d8e9b2c",
  "from":"PAR",
  "to":"TYO",
  "price":750.00,
  "currency":"EUR",
  "legs":[{"flightNum":"AZ123","dep":"PAR","arr":"TYO","duration":"12h"}],
  "hotel":{"name":"Tokyo Inn","nights":10,"price":500},
  "activity":{"title":"Visite du Mont Fuji","price":100}
}' EX 300
