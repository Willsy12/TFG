from djoser.views import (TokenCreateView, UserViewSet)
from djoser.conf import settings
from rest_framework.response import Response
from apiWeb.models import CustomList, ElementList, Rating, User, Videogame, WishList
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, filters, status
from apiWeb.serializers import CustomListSerializer, ElementListSerializer, RatingSerializer, VideogameSerializer, WishListSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound

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

class CustomLists(viewsets.ModelViewSet):
    serializer_class = CustomListSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id' 

    def create(self, request, *args, **kwargs):
        try:
            user = self.request.user
            request_nombre = request.data.get('nombre')
            if len(request_nombre) < 1:
                return Response({'detail':"Se ha producido un error al crear la lista"}, status.HTTP_400_BAD_REQUEST)
 
            customList = CustomList.objects.create(nombre=request_nombre, idUsuario=user)
            serializer = CustomListSerializer(customList)
            return Response(serializer.data, status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail':"Se ha producido un error al crear la lista"}, status.HTTP_400_BAD_REQUEST)
        
    def retrieve(self, request, pk=None):
        user = self.request.user
        try:
            videogame = CustomList.objects.get(pk=pk, idUsuario=user)
            serializer = CustomListSerializer(videogame)
            return Response(serializer.data, status.HTTP_200_OK)
        except Exception as e:
            raise NotFound("Se produjo un error inesperado. Intentelo de nuevo")

    def get_queryset(self):
        user = self.request.user
        return CustomList.objects.filter(idUsuario=user)

    def destroy(self, request, *args, **kwargs):
        idLista = kwargs.get('pk')
        user = self.request.user
        try:
            custom_list = CustomList.objects.get(id=idLista, idUsuario=user)
            custom_list.delete()
            return Response({"detail": "Se ha eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e :
            raise NotFound("No se encontro la lista solicitada")
    
class ElementLists(viewsets.ModelViewSet):
    serializer_class = ElementListSerializer

    def create(self, request, *args, **kwargs):
        try:
            user = self.request.user
            request_idVideojuego = request.data.get('idVideojuego')
            idLista = kwargs.get('idLista')
            custom_list = CustomList.objects.get(id=idLista, idUsuario=user)
            videojuego = Videogame.objects.get(id=request_idVideojuego)
            elementList = ElementList.objects.create(idLista=custom_list, idVideojuego=videojuego)
            serializer = ElementListSerializer(elementList)
            return Response(serializer.data, status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail':"Se ha producido un error al añadir el videojuego a la lista"}, status.HTTP_400_BAD_REQUEST)
        
    def get_queryset(self):
        idLista = self.kwargs.get('idLista')  
        user = self.request.user
        try:
            list = CustomList.objects.filter(idUsuario=user, id=idLista)
            if(list.exists()):
                return ElementList.objects.filter(idLista=idLista)               
            else: 
                raise NotFound()

        except Exception as e:
                raise NotFound("No se encontro la informacion adecuada, pruebe otra vez")

class WishLists(viewsets.ModelViewSet):
    serializer_class = WishListSerializer

    def get_queryset(self):
        user = self.request.user
        wishLists = WishList.objects.filter(isPlayedList=False, idUsuario=user)
        return wishLists

    def create(self, request, *args, **kwargs):
        try:
            user = self.request.user
            request_videogame = request.data.get('idVideojuego')
            
            videogame = Videogame.objects.get(id=request_videogame)
            videogameInWishList = WishList.objects.filter(idUsuario=user, idVideojuego=videogame, isPlayedList=False)
            if(videogameInWishList.exists()):
                return Response({'detail': "El videojuego ya esta añadido a la wishList"}, status.HTTP_409_CONFLICT)
            
            wishList = WishList.objects.create(idVideojuego=videogame, idUsuario=user)
            serializer = WishListSerializer(wishList)
            return Response(serializer.data, status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail':"Se ha producido un error al añadir el videojuego en la lista"}, status.HTTP_400_BAD_REQUEST)
        
    def destroy(self, request, *args, **kwargs):
        idVideojuego = kwargs.get('idVideojuego')
        user = self.request.user
        try:
            wishList = WishList.objects.get(idVideojuego=idVideojuego, idUsuario=user, isPlayedList=False)
            wishList.delete()
            return Response({"detail": "Se ha eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e :
            raise NotFound("No se encontro el videojuego asociado a la lista")
        
    def retrieve(self, request, idVideojuego=None):
        user = self.request.user
        try:
            videogame = Videogame.objects.get(id=idVideojuego)
            videogameInPlayedList = WishList.objects.get(idVideojuego=videogame, idUsuario=user, isPlayedList=False)
            return Response({'exists': True}, status=status.HTTP_200_OK)
        
        except WishList.DoesNotExist:
            return Response({'exists': False}, status=status.HTTP_200_OK)
        
        except Videogame.DoesNotExist:
            return Response({'exists': False}, status=status.HTTP_200_OK)

class PlayedLists(viewsets.ModelViewSet):
    serializer_class = WishListSerializer

    def get_queryset(self):
        user = self.request.user
        wishLists = WishList.objects.filter(isPlayedList=True, idUsuario=user)
        return wishLists

    def create(self, request, *args, **kwargs):
        try:
            user = self.request.user
            request_videogame = request.data.get('idVideojuego')
            
            videogame = Videogame.objects.get(id=request_videogame)
            videogameInWishList = WishList.objects.filter(idUsuario=user, idVideojuego=videogame, isPlayedList=True)
            if(videogameInWishList.exists()):
                return Response({'detail': "El videojuego ya esta añadido a la playedList"}, status.HTTP_409_CONFLICT)
            
            wishList = WishList.objects.create(idVideojuego=videogame, idUsuario=user, isPlayedList=True)
            serializer = WishListSerializer(wishList)
            return Response(serializer.data, status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'detail':"Se ha producido un error al añadir el videojuego en la lista"}, status.HTTP_400_BAD_REQUEST)
        
    def destroy(self, request, *args, **kwargs):
        idVideojuego = kwargs.get('idVideojuego')
        user = self.request.user
        try:
            wishList = WishList.objects.get(idVideojuego=idVideojuego, idUsuario=user, isPlayedList=True)
            wishList.delete()
            return Response({"detail": "Se ha eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e :
            print(e)
            raise NotFound("No se encontro el videojuego asociado a la lista")
    
    def retrieve(self, request, idVideojuego=None):
        user = self.request.user
        try:
            videogame = Videogame.objects.get(id=idVideojuego)
            videogameInPlayedList = WishList.objects.get(idVideojuego=videogame, idUsuario=user, isPlayedList=True)
            return Response({'exists': True}, status=status.HTTP_200_OK)
        
        except WishList.DoesNotExist:
            return Response({'exists': False}, status=status.HTTP_200_OK)
        
        except Videogame.DoesNotExist:
            return Response({'exists': False}, status=status.HTTP_200_OK)

class Ratings(viewsets.ModelViewSet):
    serializer_class = RatingSerializer

    def create(self, request, *args, **kwargs):
        try:
            user = self.request.user
            idVideojuego = request.data.get('idVideojuego')
            estrellas = request.data.get('estrellas')
            comentario = request.data.get('comentario')

            videogame = Videogame.objects.get(id=idVideojuego)

            rating = Rating.objects.create(
                idUsuario=user, idVideojuego=videogame, comentario=comentario, estrellas=estrellas)
            
            serializer = RatingSerializer(rating)
            return Response(serializer.data, status.HTTP_201_CREATED)
        
        except Videogame.DoesNotExist:
            return Response({'detail': 'No se encontro el videojuego'}, status=status.HTTP_404_NOT_FOUND)
            

    def get_queryset(self):
        idVideojuego = self.kwargs.get('idVideojuego')
        return Rating.objects.filter(idVideojuego=idVideojuego)