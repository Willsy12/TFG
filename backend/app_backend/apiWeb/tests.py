from django.test import TestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from apiWeb.models import CustomList, ElementList, User, Videogame, WishList
import uuid

TEST_USERNAME = 'Test_username'
TEST_PASSWORD = 'SecurePassword123'
BASE_URL = '/api/v1/'
UUID = '823e231a-114e-45c4-8f34-5f2072d7c330'
UUID_2 = '185fa083-b86c-4fdf-9194-bd72a48d4632'

class BaseTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Crear un usuario de prueba
        cls.test_user = User.objects.create_user(
            username=TEST_USERNAME,
            password=TEST_PASSWORD,
            id=UUID
        )
        cls.token = Token.objects.create(user=cls.test_user)

        # Crear videojuegos de prueba
        cls.test_videogame_1 = Videogame.objects.create(
            id=uuid.uuid4(),
            título="Test_videogame_1",
            añoLanzamiento=2019,
            genero=Videogame.TipoGenero.ACCION,
            resumen='Resumen',
            imagen='link_image',
            desarrolladora='Test_developer'
        )
        cls.test_videogame_2 = Videogame.objects.create(
            título="Test_videogame_2",
            añoLanzamiento=1990,
            genero=Videogame.TipoGenero.DEPORTE,
            resumen='Resumen',
            imagen='link_image',
            desarrolladora='Test_developer'
        )

    def setUp(self):
        # Configurar el cliente de API con el token de autenticación
        self.auth_header = f"Token {self.token.key}"
        self.client = APIClient()

class UserAccess(BaseTestCase):
    def test_000_user_login_success(self):
        request = {"username": TEST_USERNAME, "password": TEST_PASSWORD}
        response = self.client.post(f"{BASE_URL}login/", request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user_id'].__str__(), UUID)

    def test_001_user_login_fail(self):
        request = {"username": "ERROR", "password": TEST_PASSWORD}
        response = self.client.post(f"{BASE_URL}login/", request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_002_user_logout(self):
        auth_header = f"Token {self.token.key}"
        self.client.post(f"{BASE_URL}token/logout/", HTTP_AUTHORIZATION=auth_header)
        response = self.client.get(f"{BASE_URL}users/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_003_user_register_fail_username_exists(self):
        request = {
            "username": TEST_USERNAME,
            "email": "g@g.com",
            "password": TEST_PASSWORD
        }
        response = self.client.post(f'{BASE_URL}users/', request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_004_user_register_fail_invalid_email(self):
        request = {
            "username": "example",
            "email": "example",
            "password": TEST_PASSWORD
        }
        response = self.client.post(f'{BASE_URL}users/', request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_005_user_register_fail_invalid_password(self):
        request = {
            "username": "example",
            "email": "example@example.com",
            "password": "01"
        }
        response = self.client.post(f'{BASE_URL}users/', request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class VideogameSearch(BaseTestCase):
    def test_000_videogame_search(self):
        response = self.client.get(f'{BASE_URL}videojuegos/', HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_001_videogame_search_found_with_filters(self):
        response = self.client.get(
            f'{BASE_URL}videojuegos/',
            QUERY_STRING=f'añoLanzamiento={self.test_videogame_1.añoLanzamiento}',
            HTTP_AUTHORIZATION=self.auth_header
        )
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertEqual(item['id'], str(self.test_videogame_1.id))
            self.assertEqual(item['título'], self.test_videogame_1.título)
            self.assertEqual(item['añoLanzamiento'], self.test_videogame_1.añoLanzamiento)
            self.assertEqual(item['resumen'], self.test_videogame_1.resumen)
            self.assertEqual(item['imagen'], self.test_videogame_1.imagen)
            self.assertEqual(item['desarrolladora'], self.test_videogame_1.desarrolladora)

    def test_002_videogame_search_not_found_with_filters(self):
        response = self.client.get(
            f'{BASE_URL}videojuegos/',
            QUERY_STRING=f'título=NOTFOUND',
            HTTP_AUTHORIZATION=self.auth_header
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

class CustomListDisplay(BaseTestCase):
    def setUp(self):
        super().setUp() 
        self.customList = CustomList.objects.create(id=UUID, nombre="EXAMPLE",idUsuario=self.test_user)
        self.elementList = ElementList.objects.create(id=UUID, idVideojuego=self.test_videogame_1, idLista=self.customList)

    def test_000_customList_display(self):
        response = self.client.get(
            f'{BASE_URL}myLists/',
            HTTP_AUTHORIZATION=self.auth_header
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertEqual(item['idUsuario'].__str__(), self.test_user.id)
            self.assertEqual(item['nombre'], self.customList.nombre, "EXAMPLE")

    def test_001_customList_elements_display(self):
        response = self.client.get(
            f'{BASE_URL}myLists/{self.customList.id}/elements',
            HTTP_AUTHORIZATION=self.auth_header
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) 

        for item in response.data:
            element = item['idVideojuego']
            self.assertEqual(element['título'], self.test_videogame_1.título)
            self.assertEqual(element['desarrolladora'], self.test_videogame_1.desarrolladora)
            self.assertEqual(element['añoLanzamiento'], self.test_videogame_1.añoLanzamiento)
            self.assertEqual(element['genero'], self.test_videogame_1.genero)
            self.assertEqual(element['resumen'], self.test_videogame_1.resumen)

    def test_002_customList_not_found(self):
        response = self.client.get(
            f'{BASE_URL}myLists/UUID_ERROR/',
            HTTP_AUTHORIZATION=self.auth_header
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_003_customLists_not_display_client_not_authenticated(self):
        response = self.client.get(
            f'{BASE_URL}myLists/',
            HTTP_AUTHORIZATION=UUID
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_004_customList_add(self):
        request = {"nombre": "EJEMPLO"}
        response = self.client.post(
            f'{BASE_URL}myLists/',
            HTTP_AUTHORIZATION = self.auth_header,
            data=request
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        responseGet = self.client.get(
            f'{BASE_URL}myLists/',
            HTTP_AUTHORIZATION = self.auth_header
        )

        self.assertEqual(len(responseGet.data), 2)

    def test_005_customList_delete(self):
        response = self.client.delete(
            f'{BASE_URL}myLists/{self.customList.id}/',
            HTTP_AUTHORIZATION = self.auth_header,
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(response.data), 0)
    
    def test_006_customList_element_add(self):
        request = {"idVideojuego": self.test_videogame_1.id}
        response = self.client.post(
            f'{BASE_URL}myLists/{self.customList.id}/elements/',
            HTTP_AUTHORIZATION = self.auth_header,
            data=request
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class WishListAndPlayedListTest(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.videogameInWishList = WishList.objects.create(id=UUID, idUsuario=self.test_user,idVideojuego=self.test_videogame_1)
        self.videogameInPlayedList = WishList.objects.create(id=UUID_2,idUsuario=self.test_user,idVideojuego=self.test_videogame_1, isPlayedList=True)

    def test_000_wish_list_display_videogames(self):
        response = self.client.get(f"{BASE_URL}wishList/",
            HTTP_AUTHORIZATION = self.auth_header,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item = response.data
        for i in item:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(i['id'], self.videogameInWishList.id)
            self.assertEqual(i['isPlayedList'], False)

    def test_001_wish_list_add_videogame(self):
        request = {"idVideojuego": self.test_videogame_2.id }
        response = self.client.post(f"{BASE_URL}wishList/", 
            HTTP_AUTHORIZATION = self.auth_header,
            data=request
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        item = response.data

        self.assertIsNotNone(item['id'])
        self.assertEqual(item['isPlayedList'], False)

    def test_002_wish_list_remove_videogame(self):
        response = self.client.delete(f"{BASE_URL}wishList/{self.test_videogame_1.id}/", 
            HTTP_AUTHORIZATION = self.auth_header,
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        item = response.data
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(item['detail'], "Se ha eliminado correctamente")

    
    def test_003_wish_list_add_same_videogame(self):
        request = {"idVideojuego": self.test_videogame_1.id }
        response = self.client.post(f"{BASE_URL}wishList/", 
            HTTP_AUTHORIZATION = self.auth_header,
            data=request
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        item = response.data
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(item['detail'], "El videojuego ya esta añadido a la wishList")

    def test_004_played_list_display_videogames(self):
        response = self.client.get(f"{BASE_URL}playedList/",
            HTTP_AUTHORIZATION = self.auth_header,
        )

        item = response.data
        for i in item:
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(i['id'], self.videogameInPlayedList.id)
            self.assertEqual(i['isPlayedList'], True)


    def test_005_played_list_add_videogame(self):
        request = {"idVideojuego": self.test_videogame_2.id }
        response = self.client.post(f"{BASE_URL}playedList/", 
            HTTP_AUTHORIZATION = self.auth_header,
            data=request
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        item = response.data

        self.assertIsNotNone(item['id'])
        self.assertEqual(item['isPlayedList'], True)

    def test_006_played_list_remove_videogame(self):
        response = self.client.delete(f"{BASE_URL}playedList/{self.test_videogame_1.id}/", 
            HTTP_AUTHORIZATION = self.auth_header,
        )
        item = response.data
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(item['detail'], "Se ha eliminado correctamente")

    def test_007_played_list_add_same_videogame(self):
        request = {"idVideojuego": self.test_videogame_1.id }
        response = self.client.post(f"{BASE_URL}playedList/", 
            HTTP_AUTHORIZATION = self.auth_header,
            data=request
        )
        item = response.data
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(item['detail'], "El videojuego ya esta añadido a la playedList")
