from djoser.views import (TokenCreateView, UserViewSet)
from djoser.conf import settings
from rest_framework.response import Response
from apiWeb.models import CustomList, ElementList, Friendship, Rating, User, Videogame, WishList
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, filters, status
from apiWeb.serializers import CustomListSerializer, ElementListSerializer, FriendshipSerializer, RatingSerializer, UserCreateSerializer, VideogameSerializer, WishListSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from django.db.models import Q

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
    
    def update(self, request, *args, **kwargs):
        try:
            user = self.request.user
            idLista = kwargs.get('pk')  # Obtener el ID de la lista desde los parámetros de la URL
            request_nombre = request.data.get('nombre')
            if len(request_nombre) < 1:
                return Response({'detail':"Se ha producido un error al crear la lista"}, status.HTTP_400_BAD_REQUEST)
 
            customList = CustomList.objects.get(id=idLista, idUsuario=user)

            # Actualizar el nombre de la lista
            customList.nombre = request_nombre
            customList.save()

            # Serializar y devolver la lista actualizada
            serializer = CustomListSerializer(customList)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'detail':"Se ha producido un error al crear la lista"}, status.HTTP_400_BAD_REQUEST)
        
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

    def update(self, request, *args, **kwargs):
        try:
            user = self.request.user
            request_idVideojuego = request.data.get('idVideojuego')
            idLista = kwargs.get('idLista')
            custom_list = CustomList.objects.get(id=idLista, idUsuario=user)
            videojuego = Videogame.objects.get(id=request_idVideojuego)
            elementList = ElementList.objects.filter(idLista=custom_list, idVideojuego=videojuego)
            if not elementList.exists():
                return self.create(request, *args, **kwargs)

            return Response({"detail": "Se ha actualizado correctamente"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'detail':"Se ha producido un error al añadir el videojuego a la lista"}, status.HTTP_400_BAD_REQUEST)
        
    def destroy(self, request, *args, **kwargs):
        try:
            user = self.request.user
            request_idVideojuego = kwargs.get('idVideojuego')
            idLista = kwargs.get('idLista')
            custom_list = CustomList.objects.get(id=idLista, idUsuario=user)
            videojuego = Videogame.objects.get(id=request_idVideojuego)
            elementList = ElementList.objects.get(idLista=custom_list, idVideojuego=videojuego)
            elementList.delete()
            return Response({"detail": "Se ha eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(e)
            return Response({'detail':"Se ha producido un error al añadir el videojuego a la lista"}, status.HTTP_400_BAD_REQUEST)
        
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

class AllRatings(viewsets.ModelViewSet):
    serializer_class = RatingSerializer

    def get_queryset(self):
        return Rating.objects.all()

class AllWishList(viewsets.ModelViewSet):
    serializer_class = WishListSerializer

    def get_queryset(self):
            return WishList.objects.all()
    
class FriendShips(viewsets.ModelViewSet):
    serializer_class = FriendshipSerializer

    def get_queryset(self):
        user = self.request.user
        friendships = Friendship.objects.filter(Q(idUsuario1=user) | Q(idUsuario2=user))
        return friendships

    def create(self, request, *args, **kwargs):
        try:
            user = self.request.user
            iduser2 = request.data.get('idUsuario')

            user2 = User.objects.get(id=iduser2)

            currentsFriendships = Friendship.objects.filter(
                Q(idUsuario1=user, idUsuario2=user2) | Q(idUsuario1=user2, idUsuario2=user), estado=Friendship.Status.ACEPTADO)
            
            if not currentsFriendships.exists():
                friendship = Friendship.objects.filter(
                    Q(idUsuario1=user, idUsuario2=user2) | Q(idUsuario1=user2, idUsuario2=user), estado=Friendship.Status.PENDIENTE)
                
                if friendship.exists():
                    estado = request.data.get('estado')
                    friendship.update(estado=estado)
                    return Response({'detail': "Se ha actualizado el estado de la amistad"}, status.HTTP_202_ACCEPTED)
                else:
                    friendShip = Friendship.objects.create(idUsuario1=user, idUsuario2=user2, estado=Friendship.Status.PENDIENTE)
                    serializer = FriendshipSerializer(friendShip)
                    return Response(serializer.data, status.HTTP_201_CREATED)
            
            else: 
                return Response({'detail': "Ya existe amistad con este usuario"}, status.HTTP_304_NOT_MODIFIED)
        except Exception as e:
            return Response({'detail':"Se ha producido un error al crear/modificar la amistad"}, status.HTTP_400_BAD_REQUEST)

class UserList(viewsets.ModelViewSet):
    serializer_class = UserCreateSerializer
    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        
        queryset = User.objects.filter(is_superuser=False)
        
        if username:
            queryset = queryset.filter(username__icontains=username)
        
        return queryset