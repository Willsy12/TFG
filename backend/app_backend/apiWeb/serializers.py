from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from rest_framework import serializers
from apiWeb.models import User

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'password')