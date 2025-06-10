import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service'; // Importe le service d'authentification

// Crée le contexte d'authentification
const AuthContext = createContext();

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  // État pour stocker les informations de l'utilisateur connecté
  const [user, setUser] = useState(null);
  // État pour indiquer si le chargement initial est terminé (vérification du localStorage)
  const [loading, setLoading] = useState(true);

  // Effet qui s'exécute une seule fois au montage du composant
  useEffect(() => {
    // Vérifie si l'utilisateur est déjà connecté (token dans localStorage)
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser); // Définit l'utilisateur si trouvé dans localStorage
    }
    setLoading(false); // Indique que le chargement initial est terminé
  }, []); // Le tableau vide [] assure que l'effet ne s'exécute qu'une seule fois

  // Fonction de connexion
  const login = async (username, password) => {
    const userData = await authService.login(username, password);
    setUser(userData); // Met à jour l'état de l'utilisateur
    return userData; // Retourne les données de l'utilisateur (tokens)
  };

  // Fonction de déconnexion
  const logout = () => {
    authService.logout(); // Appelle la fonction de déconnexion du service
    setUser(null); // Réinitialise l'état de l'utilisateur
  };

  // Fonction d'inscription
  const register = async (username, email, password) => {
     await authService.register(username, email, password);
     // Après l'inscription, vous pourriez vouloir connecter l'utilisateur automatiquement
     // await login(username, password);
  };

  // Valeur fournie par le contexte
  const contextValue = {
    user, // Informations de l'utilisateur
    loading, // État de chargement initial
    login, // Fonction de connexion
    logout, // Fonction de déconnexion
    register, // Fonction d'inscription
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children} {/* Affiche les enfants une fois que le chargement initial est terminé */}
      {/* Optionnel : afficher un indicateur de chargement pendant le chargement initial */}
      {/* {loading && <div>Chargement...</div>} */}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
