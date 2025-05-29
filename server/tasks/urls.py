from django.urls import path
from .views import (
    ProjectListCreateView,
    ProjectRetrieveUpdateDestroyView,
    TaskListCreateView,
    TaskRetrieveUpdateDestroyView,
)
urlpatterns = [
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'), # Supprimez views.
    path('projects/<int:pk>/', ProjectRetrieveUpdateDestroyView.as_view(), name='project-detail'), # Supprimez views.
    path('projects/<int:project_pk>/tasks/', TaskListCreateView.as_view(), name='task-list-create'), # Supprimez views.
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyView.as_view(), name='task-detail'), # Supprimez views.
    # ...
]
