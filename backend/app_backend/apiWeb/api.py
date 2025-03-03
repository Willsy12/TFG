from djoser.views import (TokenCreateView, UserViewSet)
from djoser.conf import settings
from apiWeb.models import User


class Login(TokenCreateView):
    def _action(self, serializer):
        response = super()._action(serializer)
        requestToken = response.data['auth_token']
        responseToken = settings.TOKEN_MODEL.objects.get(key=requestToken)
        response.data['user_id'] = responseToken.user.id

        return response
