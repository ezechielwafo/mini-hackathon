import api from './api'; // Importe l'instance Axios configurée
import authHeader from './auth-header'; // Importe la fonction pour obtenir l'en-tête d'autorisation

// URL de base des endpoints de projets (relatifs à la baseURL définie dans api.js)
const PROJECTS_URL = '/projects/';

// Fonction pour obtenir la liste des projets de l'utilisateur connecté
const getProjects = () => {
  // Fait une requête GET vers l'endpoint des projets
  // Ajoute l'en-tête d'autorisation JWT
  return api.get(PROJECTS_URL, { headers: authHeader() });
};

// Fonction pour créer un nouveau projet
const createProject = (name, description) => {
  // Fait une requête POST vers l'endpoint des projets
  // Ajoute l'en-tête d'autorisation JWT
  // Envoie les données du nouveau projet dans le corps de la requête
  return api.post(PROJECTS_URL, { name, description }, { headers: authHeader() });
};

// Ajoutez ici d'autres fonctions pour le CRUD des projets si nécessaire
// const getProject = (id) => { ... }
// const updateProject = (id, data) => { ... }
// const deleteProject = (id) => { ... }

// Exporte les fonctions du service de projets
const projectService = {
  getProjects,
  createProject,
  // ...
};

export default projectService;
