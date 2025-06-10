# Utilise une image Python comme base
FROM python:3.11-slim

# Installe les dépendances système nécessaires
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Installe Poetry proprement
RUN curl -sSL https://install.python-poetry.org | python3 && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry

# Ajoute Poetry au PATH
ENV PATH="/root/.local/bin:$PATH"

# Empêche la création d'un venv pour que les paquets soient installés globalement dans le conteneur
RUN poetry config virtualenvs.create false

# Copie les fichiers de configuration de Poetry
COPY pyproject.toml poetry.lock* /app/

# Installe les dépen
RUN poetry install --no-interaction --no-ansi --no-root

# Copie le reste du code de l'application
COPY . /app

# Expose le port sur lequel l'application écoute
EXPOSE 8000

# Commande par défaut pour lancer le serveur Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

