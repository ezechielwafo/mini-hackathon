import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Importe le composant LoginPage
import ProjectDetailPage from './pages/ProjectDetailPage'; 
import ProjectsPage from './pages/ProjectsPage'; // Assurez-vous que cette ligne est présente et non commentée
// Importez ici les autres pages que vous créerez (ProjectDetailPage)
// import ProjectDetailPage from './pages/ProjectDetailPage';

import { AuthProvider, useAuth } from './context/AuthContext'; // Importe le fournisseur et le hook du contexte

// Composant utilitaire pour les routes privées (nécessite une authentification)
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Accède à l'utilisateur et à l'état de chargement du contexte

  if (loading) {
    // Optionnel : afficher un indicateur de chargement pendant la vérification initiale de l'authentification
    return <div>Chargement de l'authentification...</div>;
  }

  // Si l'utilisateur est connecté, affiche les enfants (le composant de la page)
  // Sinon, redirige vers la page de connexion
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    // Enveloppe toute l'application avec le fournisseur d'authentification
    <AuthProvider>
      <Router> {/* Assurez-vous que <Router> est présent */}
        <Routes> {/* Assurez-vous que <Routes> est présent */}
          {/* Route pour la page de connexion */}
          <Route path="/login" element={<LoginPage />} />

          {/* Route privée pour la page des projets */}
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <ProjectsPage /> {/* Assurez-vous que ProjectsPage est utilisé ici */}
              </PrivateRoute>
            }
          />
	 {/* Ajoutez cette route pour la page de détail du projet */}
           <Route
            path="/projects/:projectId"
            element={
              <PrivateRoute>
                <ProjectDetailPage />
              </PrivateRoute>
            }
          />
           {/* Exemple de route privée pour la page de détail d'un projet */}
           {/*
           <Route
            path="/projects/:projectId"
            element={
              <PrivateRoute>
                <ProjectDetailPage />
              </PrivateRoute>
            }
          />
           */}

          {/* Redirection par défaut : redirige vers /projects si l'utilisateur est connecté, sinon vers /login */}
          <Route
            path="*"
            element={
               <PrivateRoute>
                 {/* Redirige vers /projects si PrivateRoute permet l'accès */}
                 <Navigate to="/projects" />
               </PrivateRoute>
            }
          />
        </Routes> {/* Assurez-vous que </Routes> est présent */}
      </Router> {/* Assurez-vous que </Router> est présent */}
    </AuthProvider> // Assurez-vous que </AuthProvider> est présent
  );
}

export default App;
