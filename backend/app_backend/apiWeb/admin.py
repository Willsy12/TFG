from chess import Status
from django.contrib import admin
from django.forms import ValidationError
from requests import Response
from .models import CustomList, ElementList, Friendship, Rating, Videogame, WishList
from rest_framework import viewsets, filters, status

# Register your models here.
class VideogameAdmin(admin.ModelAdmin):
    list_display = ('título', 'genero', 'añoLanzamiento', 'desarrolladora', 'id')
    search_fields = ('título', 'desarrolladora')
    list_filter = ('genero', 'añoLanzamiento')
    fieldsets = (
        (None, {
            'fields': ('título', 'genero', 'añoLanzamiento', 'desarrolladora', 'imagen', 'resumen')
        }),
    )

class CustomListAdmin(admin.ModelAdmin):
    list_display = ('idUsuario','nombre')
    fieldsets = ( 
        (None ,{
            'fields': ('idUsuario', 'nombre')
        }),
    )

class ElementListAdmin(admin.ModelAdmin):
    list_display = ('idLista', 'idVideojuego')
    fieldsets = (
        (None ,{
            'fields': ('idLista', 'idVideojuego')
        }),
    )

class WishListAdmin(admin.ModelAdmin):
    list_display = ('idUsuario', 'idVideojuego', 'isPlayedList')
    fieldsets = (
        (None ,{
            'fields': ('idUsuario', 'idVideojuego', 'isPlayedList')
        }),
    )

    def save_model(self, request, obj, form, change):
        if WishList.objects.filter(idVideojuego=obj.idVideojuego, idUsuario=obj.idUsuario).exists():
            raise ValidationError("El videojuego ya está añadido a la wishList para este usuario.")
        super().save_model(request, obj, form, change)

class RatingAdmin(admin.ModelAdmin):
    list_display = ('idUsuario', 'idVideojuego', 'estrellas', 'comentario')
    fieldsets = (
        (None , {
            'fields': ('idUsuario', 'idVideojuego', 'estrellas', 'comentario')
        }),
    )

class FriendshipAdmin(admin.ModelAdmin):
    list_display = ('idUsuario1', 'idUsuario2', 'estado')
    fieldsets = (
        (None,{
            'fields' :('idUsuario1', 'idUsuario2', 'estado')
        }),
    )

admin.site.register(Videogame, VideogameAdmin)
admin.site.register(CustomList, CustomListAdmin)
admin.site.register(ElementList, ElementListAdmin)
admin.site.register(WishList,WishListAdmin)
admin.site.register(Rating,RatingAdmin)
admin.site.register(Friendship,FriendshipAdmin)