from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from rest_framework import serializers
from apiWeb.models import CustomList, ElementList, User, Videogame, WishList

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
    class Meta():
        model = WishList
        fields = '__all__'
        depth = 1