from django.test import TestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase, APIClient
from apiWeb.models import User, Videogame

TEST_USERNAME = 'Test_username'
TEST_PASSWORD = 'SecurePassword123'
BASE_URL = '/api/v1/'
UUID = '823e231a-114e-45c4-8f34-5f2072d7c330'

TEST_VIDEOGAME = 'Test_videogame'

class UserAccess(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(
            username=TEST_USERNAME,
            password=TEST_PASSWORD,
            id = UUID
        )
        self.client = APIClient()
        self.token = Token.objects.create(user=self.test_user)
    
    def test000_user_login_sucess(self):
        request = {"username": TEST_USERNAME, "password": TEST_PASSWORD}
        response = self.client.post(f"{BASE_URL}login/", request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user_id'].__str__(), UUID)

    def test001_user_login_fail(self):
        request = {"username": "ERROR", "password": TEST_PASSWORD}
        response = self.client.post(f"{BASE_URL}login/", request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test002_user_logout(self):
        auth_header = f"Token {self.token.key}"
  
        self.client.post(f"{BASE_URL}'token/logout/",
            HTTP_AUTHORIZATION=auth_header)

        response = self.client.get(f"{BASE_URL}users/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
         
    def test004_user_register_fail_username_exists(self):
        request = {
            "username": TEST_USERNAME,
            "email": "g@g.com",
            "password": TEST_PASSWORD
        }

        response = self.client.post(f'{BASE_URL}users/', request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test005_user_register_fail_invalid_email(self):
        request = {
            "username": "example",
            "email": "example",
            "password": TEST_PASSWORD
        }

        response = self.client.post(f'{BASE_URL}users/', request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test006_user_register_fail_invalid_password(self):
        request = {
            "username": "example",
            "email": "example",
            "password": "01"
        }

        self.client.post(f'{BASE_URL}users/', request)

        response = self.client.post(f'{BASE_URL}users/', request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class VideogameSearch(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(
            username=TEST_USERNAME,
            password=TEST_PASSWORD,
            id = UUID
        )
        self.token = Token.objects.create(user=self.test_user)
        self.test_videogame_1 = Videogame.objects.create(
            id=UUID,
            título="Test_videogame_1",
            añoLanzamiento=2019,
            genero=Videogame.TipoGenero.ACCION, 
            resumen='Resumen',
            imagen='link_image', 
            desarrolladora='Test_developer')
        
        self.test_videogame_2 = Videogame.objects.create(
            título="Test_videogame_2",
            añoLanzamiento=1990,
            genero=Videogame.TipoGenero.DEPORTE, 
            resumen='Resumen',
            imagen='link_image',
            desarrolladora='Test_developer')
        
        self.auth_header = f"Token {self.token.key}"
        self.client = APIClient()
    
    def test_000_videogame_search(self): 
        response = self.client.get(f'{BASE_URL}videojuegos/', HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_001_videogame_search_found_with_filters(self):
        response = self.client.get(f'{BASE_URL}videojuegos/',QUERY_STRING=f'añoLanzamiento={self.test_videogame_1.añoLanzamiento}', HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertEqual(item['id'], self.test_videogame_1.id.__str__())
            self.assertEqual(item['título'], self.test_videogame_1.título)
            self.assertEqual(item['añoLanzamiento'], self.test_videogame_1.añoLanzamiento)
            self.assertEqual(item['resumen'], self.test_videogame_1.resumen)
            self.assertEqual(item['imagen'], self.test_videogame_1.imagen)
            self.assertEqual(item['desarrolladora'], self.test_videogame_1.desarrolladora)

    def test_001_videogame_search_not_found_with_filters(self):
        response = self.client.get(f'{BASE_URL}videojuegos/', QUERY_STRING=f'título=NOTFOUND', HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])
      

