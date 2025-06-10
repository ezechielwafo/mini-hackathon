import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Pour obtenir l'ID du projet depuis l'URL
import { Container, Typography, Box, CircularProgress, Grid, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import taskService from '../services/task.service'; // Importe le service de tâches
// Importez ici le service de projets si vous avez besoin des détails du projet lui-même
// import projectService from '../services/project.service';

// Composant pour afficher une seule tâche (peut être déplacé dans components/ plus tard)
const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const handleStatusChange = (event) => {
    onStatusChange(task.id, event.target.value);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">{task.title}</Typography>
      <Typography variant="body2" color="text.secondary">{task.description}</Typography>
      {task.assigned_to && (
         <Typography variant="body2" sx={{ mt: 1 }}>Assigné à: {task.assigned_to.username}</Typography>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <InputLabel>Statut</InputLabel>
            <Select
               value={task.status}
               onChange={handleStatusChange}
               label="Statut"
            >
               <MenuItem value="todo">À faire</MenuItem>
               <MenuItem value="in_progress">En cours</MenuItem>
               <MenuItem value="done">Terminé</MenuItem>
            </Select>
         </FormControl>
         <Button size="small" color="error" onClick={handleDelete}>Supprimer</Button>
      </Box>
    </Paper>
  );
};


function ProjectDetailPage() {
  const { projectId } = useParams(); // Obtient l'ID du projet depuis l'URL
  const [project, setProject] = useState(null); // État pour les détails du projet (optionnel)
  const [tasks, setTasks] = useState([]); // État pour stocker la liste des tâches
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État d'erreur

  const [openDialog, setOpenDialog] = useState(false); // Dialogue de création de tâche
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState(''); // Pour affecter la tâche (nécessite de charger les membres du projet)

  // Effet pour charger les tâches du projet
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Optionnel : charger les détails du projet si nécessaire
        // const projectResponse = await projectService.getProject(projectId);
        // setProject(projectResponse.data);

        const tasksResponse = await taskService.getTasksByProject(projectId);
        setTasks(tasksResponse.data); // Met à jour l'état avec les tâches
      } catch (err) {
        setError('Erreur lors du chargement des tâches.');
        console.error('Erreur API lors du chargement des tâches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]); // Re-déclenche l'effet si l'ID du projet dans l'URL change

  const handleCreateTask = async () => {
     try {
        const response = await taskService.createTask(projectId, newTaskTitle, newTaskDescription, newTaskAssignedTo || null);
        // Ajoute la nouvelle tâche à la liste existante
        setTasks([...tasks, response.data]);
        // Ferme le dialogue et réinitialise les champs
        setOpenDialog(false);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskAssignedTo('');
     } catch (err) {
        setError('Erreur lors de la création de la tâche.');
        console.error('Erreur API lors de la création de la tâche:', err);
     }
  };

  const handleStatusChange = async (taskId, newStatus) => {
     try {
        // Met à jour le statut de la tâche via l'API
        await taskService.updateTask(taskId, { status: newStatus });
        // Met à jour l'état local des tâches
        setTasks(tasks.map(task =>
           task.id === taskId ? { ...task, status: newStatus } : task
        ));
     } catch (err) {
        setError('Erreur lors de la mise à jour du statut de la tâche.');
        console.error('Erreur API lors de la mise à jour du statut de la tâche:', err);
     }
  };

   const handleDeleteTask = async (taskId) => {
     try {
        // Supprime la tâche via l'API
        await taskService.deleteTask(taskId);
        // Supprime la tâche de l'état local
        setTasks(tasks.filter(task => task.id !== taskId));
     } catch (err) {
        setError('Erreur lors de la suppression de la tâche.');
        console.error('Erreur API lors de la suppression de la tâche:', err);
     }
  };


  // Fonction pour filtrer les tâches par statut
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  // Vous pouvez afficher le nom du projet ici si vous avez chargé les détails du projet
  // <Typography component="h1" variant="h4">{project ? project.name : 'Détails du Projet'}</Typography>

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
         <Typography component="h1" variant="h4">
           Détails du Projet (ID: {projectId})
         </Typography>
         <Button variant="contained" onClick={() => setOpenDialog(true)}>
           Ajouter une Tâche
         </Button>
      </Box>


      <Grid container spacing={3}>
        {/* Colonne "À faire" */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, minHeight: 300 }}>
            <Typography variant="h5" gutterBottom>À faire</Typography>
            {getTasksByStatus('todo').map(task => (
              <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} />
            ))}
          </Paper>
        </Grid>

        {/* Colonne "En cours" */}
        <Grid item xs={12} md={4}>
           <Paper elevation={2} sx={{ p: 2, minHeight: 300 }}>
             <Typography variant="h5" gutterBottom>En cours</Typography>
             {getTasksByStatus('in_progress').map(task => (
               <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} />
             ))}
           </Paper>
        </Grid>

        {/* Colonne "Terminé" */}
        <Grid item xs={12} md={4}>
           <Paper elevation={2} sx={{ p: 2, minHeight: 300 }}>
             <Typography variant="h5" gutterBottom>Terminé</Typography>
             {getTasksByStatus('done').map(task => (
               <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} />
             ))}
           </Paper>
        </Grid>
      </Grid>

       {/* Dialogue de création de tâche */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Ajouter une nouvelle tâche</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titre de la tâche"
            type="text"
            fullWidth
            variant="standard"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
           <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="standard"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
          />
          {/* Ajoutez ici un champ pour affecter la tâche si vous avez la liste des membres */}
          {/*
          <FormControl fullWidth margin="dense" variant="standard">
             <InputLabel>Assigner à</InputLabel>
             <Select
                value={newTaskAssignedTo}
                onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                label="Assigner à"
             >
                <MenuItem value="">
                   <em>Non assigné</em>
                </MenuItem>
                // Mappez ici sur la liste des membres du projet
                // {project.members.map(member => (
                //    <MenuItem key={member.id} value={member.id}>{member.username}</MenuItem>
                // ))}
             </Select>
          </FormControl>
          */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleCreateTask}>Ajouter</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default ProjectDetailPage;
