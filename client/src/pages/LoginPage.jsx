import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Pour la redirection après connexion
import authService from '../services/auth.service'; // Importe le service d'authentification
import { useAuth } from '../context/AuthContext'; // Importe le hook du contexte d'authentification

function LoginPage() {
  const [tabValue, setTabValue] = useState(0); // Pour gérer l'onglet (Connexion/Inscription)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [message, setMessage] = useState(''); // Pour afficher des messages (erreurs, succès)

  const navigate = useNavigate(); // Hook pour la navigation
  const { login, register } = useAuth(); // Accède aux fonctions login et register du contexte

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setMessage(''); // Efface les messages lors du changement d'onglet
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage(''); // Efface le message précédent
    try {
      await login(loginUsername, loginPassword);
      // Redirige vers la page des projets après une connexion réussie
      navigate('/projects');
    } catch (error) {
      // Gère les erreurs de connexion (par exemple, identifiants incorrects)
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.detail) || // Message d'erreur de DRF Simple JWT
        error.message ||
        error.toString();
      setMessage(resMessage);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage(''); // Efface le message précédent
    try {
      await register(registerUsername, registerEmail, registerPassword);
      setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      // Optionnel : passer à l'onglet de connexion après l'inscription
      setTabValue(0);
    } catch (error) {
      // Gère les erreurs d'inscription
       const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.username && error.response.data.username[0]) || // Exemple d'erreur de validation de Djoser
        (error.response &&
          error.response.data &&
          error.response.data.email && error.response.data.email[0]) ||
        (error.response &&
          error.response.data &&
          error.response.data.password && error.response.data.password[0]) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          TaskMaster
        </Typography>
        <Paper elevation={3} sx={{ width: '100%', mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Connexion" />
            <Tab label="Inscription" />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && ( // Contenu de l'onglet Connexion
              <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="loginUsername"
                  label="Nom d'utilisateur"
                  name="loginUsername"
                  autoComplete="username"
                  autoFocus
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="loginPassword"
                  label="Mot de passe"
                  type="password"
                  id="loginPassword"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Se connecter
                </Button>
              </Box>
            )}
            {tabValue === 1 && ( // Contenu de l'onglet Inscription
              <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
                 <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="registerUsername"
                  label="Nom d'utilisateur"
                  name="registerUsername"
                  autoComplete="username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="registerEmail"
                  label="Adresse Email"
                  name="registerEmail"
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="registerPassword"
                  label="Mot de passe"
                  type="password"
                  id="registerPassword"
                  autoComplete="new-password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  S'inscrire
                </Button>
              </Box>
            )}
            {message && ( // Affiche les messages d'erreur ou de succès
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginPage;
