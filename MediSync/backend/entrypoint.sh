#!/bin/sh

# Attendre que la base de données soit accessible
if [ "$DB_HOST" = "db" ] || [ -n "$DATABASE_URL" ]; then
    echo "Vérification de la connexion à la base de données..."
    # Si DB_HOST est défini, on attend sur ce port
    if [ -n "$DB_HOST" ]; then
        while ! nc -z $DB_HOST ${DB_PORT:-5432}; do
          echo "Base de données ($DB_HOST) non disponible, attente..."
          sleep 1
        done
    fi
fi

# Appliquer les migrations
echo "Application des migrations..."
python manage.py migrate --noinput

# Collecter les fichiers statiques (au cas où ce n'a pas été fait au build)
echo "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

# Lancer le serveur avec Gunicorn
# On utilise 4 workers pour plus de performance en production
echo "Lancement de Gunicorn..."
exec gunicorn --bind 0.0.0.0:8080 \
    --workers 4 \
    --threads 2 \
    --access-logfile - \
    --error-logfile - \
    backend.wsgi:application
