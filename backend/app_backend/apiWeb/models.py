from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    descripcion = models.CharField(help_text="Nombre de usuario")
    email = models.EmailField(unique=True)  # Asegurar que el email es único

    USERNAME_FIELD = 'username'  # Si quieres iniciar sesión con email en lugar de username
    REQUIRED_FIELDS = ['email']