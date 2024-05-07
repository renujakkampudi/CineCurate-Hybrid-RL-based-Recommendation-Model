from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class UserTests(APITestCase):
    def test_create_user(self):
        """Test creating a new user."""
        url = reverse('user_register')
        data = {
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'testuser@example.com',
            'username': 'testuser',
            'password': 'testpassword123',
            'confirm_password': 'testpassword123',
            'bio': 'Just a test user.',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')
        print(response.data)

    def test_user_login(self):
    # First, create a user
      self.client.post('/users/register/', {
          'first_name': 'Test',
          'last_name': 'User',
          'email': 'testuser@example.com',
          'username': 'testuser',
          'password': 'testpassword123',
          'confirm_password': 'testpassword123',
          # Include other required fields
      })

      # Then attempt to log in with the same credentials
      login_response = self.client.post('/users/login/', {
          'email': 'testuser@example.com',
          'password': 'testpassword123',
      }, format='json')

      # Print the response data from the login attempt
      print(login_response.data)

      # Check if login is successful
      self.assertEqual(login_response.status_code, 200)
      self.assertIn("Login Successful", login_response.data["message"])

class UserProfileTests(APITestCase):
    def setUp(self):
        # Create a user and set up the authentication
        self.user = User.objects.create_user(username='testuser', password='testpassword123', email='test@example.com')
        self.client.login(username='testuser', password='testpassword123')
    
    def test_update_user_profile(self):
        url = reverse('user_profile')
        data = {'first_name': 'UpdatedName', 'bio': 'Updated bio.'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'UpdatedName')
        self.assertEqual(self.user.bio, 'Updated bio.')
        print(response.data)