import api from './api'; // Importe l'instance Axios configurée
// import authHeader from './auth-header'; // Pas nécessaire d'importer authHeader ici, car ces fonctions ne nécessitent pas d'authentification (sauf si vous avez des endpoints d'auth protégés)

// URL des endpoints d'authentification (relatifs à la baseURL définie dans api.js)
const REGISTER_URL = '/auth/users/'; // Endpoint d'inscription de Djoser
const LOGIN_URL = '/token/'; // Endpoint d'obtention de token de Simple JWT
// const LOGOUT_URL = '/auth/token/logout/'; // Exemple si vous utilisez un endpoint de déconnexion (Djoser ou autre)

// Fonction pour l'inscription d'un nouvel utilisateur
const register = (username, email, password) => {
  return api.post(REGISTER_URL, { username, email, password });
};

// Fonction pour la connexion d'un utilisateur
const login = (username, password) => {
  return api.post(LOGIN_URL, { username, password })
    .then(response => {
      // Si la connexion réussit et qu'un token d'accès est reçu
      if (response.data.access) {
        // Stocke les informations de l'utilisateur (y compris les tokens) dans le stockage local
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      // Retourne les données de la réponse (tokens)
      return response.data;
    });
};

// Fonction pour la déconnexion d'un utilisateur
const logout = () => {
  // Supprime les informations de l'utilisateur du stockage local
  localStorage.removeItem('user');
  // Si vous avez un endpoint de déconnexion sur le backend, vous pourriez l'appeler ici
  // return api.post(LOGOUT_URL);
};

// Fonction pour récupérer les informations de l'utilisateur actuellement connecté depuis le stockage local
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Exporte les fonctions du service d'authentification
const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
