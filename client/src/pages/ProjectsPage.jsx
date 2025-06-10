import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, List, ListItem, ListItemText, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import projectService from '../services/project.service'; // Importe le service de projets
import { Link } from 'react-router-dom'; // Pour créer des liens vers les détails du projet

function ProjectsPage() {
  const [projects, setProjects] = useState([]); // État pour stocker la liste des projets
  const [loading, setLoading] = useState(true); // État pour indiquer si les projets sont en cours de chargement
  const [error, setError] = useState(null); // État pour stocker les erreurs
  const [openDialog, setOpenDialog] = useState(false); // État pour gérer l'ouverture/fermeture du dialogue de création
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  // Effet qui s'exécute au montage du composant pour charger les projets
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getProjects();
        setProjects(response.data); // Met à jour l'état avec la liste des projets
      } catch (err) {
        setError('Erreur lors du chargement des projets.'); // Gère les erreurs
        console.error('Erreur API lors du chargement des projets:', err);
      } finally {
        setLoading(false); // Indique que le chargement est terminé
      }
    };

    fetchProjects(); // Appelle la fonction pour charger les projets
  }, []); // Le tableau vide [] assure que l'effet ne s'exécute qu'une seule fois

  const handleCreateProject = async () => {
    try {
      const response = await projectService.createProject(newProjectName, newProjectDescription);
      // Ajoute le nouveau projet à la liste existante
      setProjects([...projects, response.data]);
      // Ferme le dialogue et réinitialise les champs
      setOpenDialog(false);
      setNewProjectName('');
      setNewProjectDescription('');
    } catch (err) {
       setError('Erreur lors de la création du projet.'); // Gère les erreurs
       console.error('Erreur API lors de la création du projet:', err);
    }
  };


  if (loading) {
    // Affiche un indicateur de chargement pendant le chargement des projets
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    // Affiche un message d'erreur si le chargement a échoué
    return (
      <Container sx={{ mt: 8 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
         <Typography component="h1" variant="h4">
           Mes Projets
         </Typography>
         <Button variant="contained" onClick={() => setOpenDialog(true)}>
           Créer un Projet
         </Button>
      </Box>


      {projects.length === 0 ? (
        // Affiche un message si aucun projet n'est trouvé
        <Typography align="center">Aucun projet trouvé. Créez-en un !</Typography>
      ) : (
        // Affiche la liste des projets
        <Paper elevation={2}>
          <List>
            {projects.map((project) => (
              <ListItem
                key={project.id}
                button // Rend l'élément cliquable
                component={Link} // Utilise Link de react-router-dom pour la navigation
                to={`/projects/${project.id}`} // Lien vers la page de détail du projet
              >
                <ListItemText
                  primary={project.name}
                  secondary={project.description || 'Aucune description'}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Dialogue de création de projet */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Créer un nouveau projet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du projet"
            type="text"
            fullWidth
            variant="standard"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
           <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleCreateProject}>Créer</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default ProjectsPage;
