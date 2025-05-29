from django.shortcuts import render

from rest_framework import generics, permissions
from .models import Project, Task
from django.contrib.auth.models import User # Assurez-vous que cette importation est présente si vous utilisez User
from .serializers import ProjectSerializer, TaskSerializer

class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated] # Seuls les utilisateurs authentifiés peuvent accéder

    def perform_create(self, serializer):
        # Associe le projet à l'utilisateur actuellement authentifié
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        # Retourne uniquement les projets dont l'utilisateur est propriétaire ou membre
        user = self.request.user
        return Project.objects.filter(owner=user) | Project.objects.filter(members=user)


class ProjectRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Permet d'accéder uniquement aux projets dont l'utilisateur est propriétaire ou membre
        user = self.request.user
        return Project.objects.filter(owner=user) | Project.objects.filter(members=user)


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Retourne uniquement les tâches du projet spécifié par project_pk dans l'URL
        project_pk = self.kwargs['project_pk']
        return Task.objects.filter(project__pk=project_pk, project__owner=self.request.user) | \
               Task.objects.filter(project__pk=project_pk, project__members=self.request.user)

    def perform_create(self, serializer):
        # Associe la tâche au projet spécifié par project_pk dans l'URL
        project_pk = self.kwargs['project_pk']
        project = Project.objects.get(pk=project_pk)
        serializer.save(project=project)


class TaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Permet d'accéder uniquement aux tâches des projets dont l'utilisateur est propriétaire ou membre
        user = self.request.user
        return Task.objects.filter(project__owner=user) | Task.objects.filter(project__members=user)

# Create your views here.
