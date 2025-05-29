import api from './api'; // Importe l'instance Axios configurée
import authHeader from './auth-header'; // Importe la fonction pour obtenir l'en-tête d'autorisation

// URL de base des endpoints de tâches (relatifs à la baseURL définie dans api.js)
// Notez que les endpoints de tâches sont imbriqués sous les projets dans notre configuration d'URLs backend
const TASKS_URL = '/projects/'; // La base pour accéder aux tâches d'un projet

// Fonction pour obtenir la liste des tâches d'un projet spécifique
const getTasksByProject = (projectId) => {
  // Fait une requête GET vers /projects/{projectId}/tasks/
  return api.get(`${TASKS_URL}${projectId}/tasks/`, { headers: authHeader() });
};

// Fonction pour créer une nouvelle tâche dans un projet spécifique
const createTask = (projectId, title, description, assigned_to = null) => {
  // Fait une requête POST vers /projects/{projectId}/tasks/
  // Notez que le backend associera automatiquement la tâche au projet via l'URL
  return api.post(`${TASKS_URL}${projectId}/tasks/`, { title, description, assigned_to }, { headers: authHeader() });
};

// Fonction pour obtenir les détails d'une tâche spécifique
const getTask = (taskId) => {
   // Fait une requête GET vers /tasks/{taskId}/
   return api.get(`/tasks/${taskId}/`, { headers: authHeader() });
};

// Fonction pour mettre à jour une tâche spécifique
const updateTask = (taskId, data) => {
   // Fait une requête PUT ou PATCH vers /tasks/{taskId}/
   // Utilisez PATCH pour mettre à jour partiellement (par exemple, juste le statut)
   return api.patch(`/tasks/${taskId}/`, data, { headers: authHeader() });
};

// Fonction pour supprimer une tâche spécifique
const deleteTask = (taskId) => {
   // Fait une requête DELETE vers /tasks/{taskId}/
   return api.delete(`/tasks/${taskId}/`, { headers: authHeader() });
};


// Exporte les fonctions du service de tâches
const taskService = {
  getTasksByProject,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};

export default taskService;
