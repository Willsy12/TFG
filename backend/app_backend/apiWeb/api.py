from djoser.views import (TokenCreateView, UserViewSet)
from djoser.conf import settings
from rest_framework.response import Response
from apiWeb.models import User, Videogame
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, filters, status
from apiWeb.serializers import VideogameSerializer

class Login(TokenCreateView):
    def _action(self, serializer):
        response = super()._action(serializer)
        requestToken = response.data['auth_token']
        responseToken = settings.TOKEN_MODEL.objects.get(key=requestToken)
        response.data['user_id'] = responseToken.user.id

        return response

class Videogames(viewsets.GenericViewSet):
    queryset = Videogame.objects.all()
    serializer_class = VideogameSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['añoLanzamiento', 'genero']
    search_fields = ['desarrolladora', 'título']  # Campos para búsqueda parcial

    def list(self, request):
        queryset = self.get_queryset()
        titulo = request.query_params.get('título', None)
        desarrolladora = request.query_params.get('desarrolladora', None)

        if titulo and desarrolladora:
            queryset = queryset.filter(título__icontains=titulo, desarrolladora__icontains=desarrolladora)
        elif titulo:
            queryset = queryset.filter(título__icontains=titulo)
        elif desarrolladora:
            queryset = queryset.filter(desarrolladora__icontains=desarrolladora)

        queryset = self.filter_queryset(queryset)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)    

class VideogameDetail(viewsets.ModelViewSet):
    def retrieve(self, request, pk=None):
        videogame = Videogame.objects.get(pk=pk)
        serializer = VideogameSerializer(videogame)
        return Response(serializer.data, status.HTTP_200_OK)
