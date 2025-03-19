from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    descripcion = models.CharField(help_text="Nombre de usuario")
    email = models.EmailField(unique=True)  # Asegurar que el email es único

    USERNAME_FIELD = 'username'  # Si quieres iniciar sesión con email en lugar de username
    REQUIRED_FIELDS = ['email']

class Videogame(models.Model):
    class TipoGenero(models.TextChoices):
        ACCION = 'ACC', 'Acción'
        AVENTURA = 'AVT', 'Aventura'
        ARCADE = 'ARC', 'Arcade'
        DEPORTE = 'DTP', 'Deporte'
        ESTRATEGIA = 'EST', 'Estrategia'
        SIMULACION = 'SIM', 'Simulacion'
        MESA = 'MES', 'Juegos de mesa'
        MUSICALES = 'MUS', 'Juegos musicales'
        
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    título = models.CharField(help_text='Título del videojuego')
    genero = models.CharField(help_text='Género', choices=TipoGenero.choices)
    añoLanzamiento = models.IntegerField(help_text='Año de lanzamiento')
    desarrolladora = models.CharField(help_text='Desarrolladora')
    imagen = models.CharField(help_text='Portada del videojuego')
    resumen = models.CharField(help_text='Sinopsis del videojuego')