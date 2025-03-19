from django.contrib import admin
from .models import Videogame

# Register your models here.
class VideogameAdmin(admin.ModelAdmin):
    list_display = ('título', 'genero', 'añoLanzamiento', 'desarrolladora')
    search_fields = ('título', 'desarrolladora')
    list_filter = ('genero', 'añoLanzamiento')
    fieldsets = (
        (None, {
            'fields': ('título', 'genero', 'añoLanzamiento', 'desarrolladora', 'imagen', 'resumen')
        }),
    )

admin.site.register(Videogame, VideogameAdmin)