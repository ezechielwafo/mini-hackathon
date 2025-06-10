# Utilise une image Python comme base
FROM python:3.11-slim

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Installe Poetry
RUN pip install poetry

# Copie les fichiers de configuration de Poetry
COPY pyproject.toml poetry.lock* /app/

# Installe les dépendances avec Poetry
RUN poetry install --no-root

# Copie le reste du code de l'application
COPY . /app

# Expose le port sur lequel l'application écoute
EXPOSE 8000

# Commande par défaut pour lancer l'application (peut être surchargée par docker-compose)
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
