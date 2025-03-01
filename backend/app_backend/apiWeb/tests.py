from django.test import TestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase, APIClient
from apiWeb.models import User

TEST_USERNAME = 'Test_username'
TEST_PASSWORD = 'SecurePassword123'
BASE_URL = '/api/v1/'

class UserAccess(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user(
            username=TEST_USERNAME,
            password=TEST_PASSWORD,
            id=1
        )
        self.client = APIClient()
        self.token = Token.objects.create(user=self.test_user)
    
    def test000_user_login_sucess(self):
        request = {"username": TEST_USERNAME, "password": TEST_PASSWORD}
        response = self.client.post(f"{BASE_URL}login/", request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user_id'], 1)

    def test001_user_login_fail(self):
        request = {"username": "ERROR", "password": TEST_PASSWORD}
        response = self.client.post(f"{BASE_URL}login/", request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test002_user_logout(self):
        auth_header = f"Token: {self.token.key}"
  
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