from rest_framework import serializers
from .models import Project, Task
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email'] # Champs de l'utilisateur à exposer

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True) # Affiche les détails de l'utilisateur propriétaire
    members = UserSerializer(many=True, read_only=True) # Affiche les détails des membres
    # Vous pourriez ajouter un champ pour ajouter/supprimer des membres par ID si nécessaire

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'members', 'created_at', 'updated_at']
        read_only_fields = ['owner', 'members', 'created_at', 'updated_at'] # Ces champs ne sont pas modifiables via l'API


class TaskSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(read_only=True) # Affiche l'ID du projet
    assigned_to = UserSerializer(read_only=True) # Affiche les détails de l'utilisateur affecté
    # Vous pourriez ajouter un champ pour affecter une tâche par ID utilisateur si nécessaire

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'project', 'assigned_to', 'created_at', 'updated_at']
        read_only_fields = ['project', 'created_at', 'updated_at'] # Ces champs ne sont pas modifiables via l'API
