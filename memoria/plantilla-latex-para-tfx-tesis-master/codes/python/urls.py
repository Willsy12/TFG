"""
URL configuration for app_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import (path, include)
from apiWeb import api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/',include('djoser.urls')),
    path('api/v1/',include('djoser.urls.authtoken')),
    path('api/v1/allUsers/', api.UserList.as_view({'get':'list'})),
    path(r'api/v1/login/', api.Login.as_view()),
    path('api/v1/videojuegos/', api.Videogames.as_view({'get':'list'})),
    path(r'api/v1/videojuegos/<str:pk>/', api.VideogameDetail.as_view({'get': 'retrieve'})),
    path(r'api/v1/myLists/', api.CustomLists.as_view({'get': 'list', 'post':'create'})),
    path(r'api/v1/myLists/<str:pk>/', api.CustomLists.as_view({'get': 'retrieve', 'delete': 'destroy', 'put': 'update'})),  
    path(r'api/v1/myLists/<str:idLista>/elements/', api.ElementLists.as_view({'get':'list', 'post': 'create', 'put': 'update'})),
    path(r'api/v1/myLists/<str:idLista>/elements/<str:idVideojuego>/', api.ElementLists.as_view({'delete':'destroy'})),
    path(r'api/v1/wishList/', api.WishLists.as_view({'get':'list', 'post':'create'})),
    path(r'api/v1/allWishList/', api.AllWishList.as_view({'get':'list'})),
    path(r'api/v1/wishList/<str:idVideojuego>/', api.WishLists.as_view({'delete': 'destroy', 'get': 'retrieve'})),
    path(r'api/v1/playedList/', api.PlayedLists.as_view({'get':'list', 'post':'create'})),
    path(r'api/v1/playedList/<str:idVideojuego>/', api.PlayedLists.as_view({'delete': 'destroy', 'get': 'retrieve'})),
    path(r'api/v1/allRatings/', api.AllRatings.as_view({'get': 'list'})),
    path(r'api/v1/ratings/<str:idVideojuego>/', api.Ratings.as_view({'get': 'list'})),
    path(r'api/v1/ratings/', api.Ratings.as_view({'post': 'create'})),
    path(r'api/v1/friendships/', api.FriendShips.as_view({'get':'list' , 'post': 'create'}))
]
