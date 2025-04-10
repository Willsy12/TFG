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

    def __str__(self):
        return self.título

class CustomList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(help_text='Nombre de la lista personalizada')
    idUsuario = models.ForeignKey(User, on_delete=models.CASCADE)

class ElementList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    idLista = models.ForeignKey(CustomList, on_delete=models.CASCADE)
    idVideojuego = models.ForeignKey(Videogame, on_delete=models.CASCADE)

class WishList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    idUsuario = models.ForeignKey(User, on_delete=models.CASCADE)
    idVideojuego = models.ForeignKey(Videogame, on_delete=models.CASCADE)
    isPlayedList = models.BooleanField(default=False)

class Rating(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    idUsuario = models.ForeignKey(User, on_delete=models.CASCADE)
    idVideojuego = models.ForeignKey(Videogame, on_delete=models.CASCADE)
    estrellas = models.DecimalField(default=0.5, decimal_places=1, max_digits=3)
    comentario = models.CharField(default='')

class Friendship(models.Model):
    class Status(models.IntegerChoices):
        ACEPTADO = 0, 'Aceptado'
        RECHAZADO = 1, 'Rechazado'
        PENDIENTE = 2, 'Pendiente'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    idUsuario1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendships_initiated')
    idUsuario2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendships_received')
    estado = models.IntegerField(choices=Status.choices, default=Status.PENDIENTE)