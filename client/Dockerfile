# Utilise une image Node.js comme base
FROM node:18-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de configuration npm
COPY package*.json /app/

# Installe les dépendances npm
RUN npm install

# Copie le reste du code de l'application
COPY . /app

# Expose le port sur lequel l'application écoute
EXPOSE 5173

# Commande par défaut pour lancer l'application (peut être surchargée par docker-compose)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
