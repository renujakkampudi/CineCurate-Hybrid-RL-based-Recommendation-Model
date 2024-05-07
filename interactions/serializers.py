# interactions/serializers.py

from rest_framework import serializers
from .models import UserPreference

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ['preferred_genres', 'preferred_actors', 'preferred_directors', 'favorite_movies', 'preferred_keywords']
