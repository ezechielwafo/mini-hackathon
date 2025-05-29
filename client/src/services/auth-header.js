// Fonction pour obtenir l'en-tête d'autorisation JWT
export default function authHeader() {
  // Récupère les informations de l'utilisateur (y compris le token) depuis le stockage local
  const user = JSON.parse(localStorage.getItem('user'));

  // Si l'utilisateur est connecté et qu'il y a un token d'accès
  if (user && user.access) {
    // Retourne l'en-tête d'autorisation au format JWT (Bearer Token)
    return { Authorization: 'Bearer ' + user.access };
  } else {
    // Sinon, retourne un objet vide (pas d'en-tête d'autorisation)
    return {};
  }
}
