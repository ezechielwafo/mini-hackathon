# Utilise une image Nginx comme base
FROM nginx:alpine

# Copie le fichier de configuration Nginx personnalisé
COPY nginx.conf /etc/nginx/nginx.conf

# Expose le port sur lequel Nginx écoute
EXPOSE 80

# Commande par défaut pour lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
