#!/bin/bash
echo "🚀 Démarrage de l'initialisation de la base MongoDB..."

echo "🔐 Connexion avec l'utilisateur : $MONGO_INITDB_ROOT_USERNAME"
echo "📂 Base de données ciblée : $MONGO_INITDB_DATABASE"
echo "📦 Tentative de création de la collection 'offers'..."

mongosh --username "$MONGO_INITDB_ROOT_USERNAME" \
        --password "$MONGO_INITDB_ROOT_PASSWORD" \
        --authenticationDatabase admin \
        "$MONGO_INITDB_DATABASE" \
        --eval "db.createCollection('offers')"

echo "✅ Collection 'offers' créée (ou déjà existante) dans la base '$MONGO_INITDB_DATABASE' !"
