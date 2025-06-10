import axios from 'axios';

// Accède à la variable d'environnement VITE_API_URL définie dans client/.env
const API_URL = import.meta.env.VITE_API_URL;

// Crée une instance Axios avec l'URL de base de l'API
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; // Exporte l'instance Axios configurée
