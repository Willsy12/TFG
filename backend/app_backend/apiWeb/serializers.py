from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from rest_framework import serializers
from apiWeb.models import CustomList, ElementList, Friendship, Rating, User, Videogame, WishList

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'password')

class VideogameSerializer(serializers.ModelSerializer):
    class Meta():
        model = Videogame
        fields = '__all__'

class CustomListSerializer(serializers.ModelSerializer):
    class Meta():
        model = CustomList
        fields = '__all__'

class ElementListSerializer(serializers.ModelSerializer):
    class Meta():
        model = ElementList
        fields = '__all__'
        depth = 1

class WishListSerializer(serializers.ModelSerializer):
    idUsuario = UserCreateSerializer()
    class Meta():
        model = WishList
        fields = '__all__'
        depth = 1

class RatingSerializer(serializers.ModelSerializer):
    idUsuario = UserCreateSerializer()
    class Meta():
        model = Rating
        fields = '__all__'
        depth = 1

class FriendshipSerializer(serializers.ModelSerializer):
    idUsuario1 = UserCreateSerializer()
    idUsuario2 = UserCreateSerializer()

    class Meta():
        model = Friendship
        fields = '__all__'
        depth = 1
