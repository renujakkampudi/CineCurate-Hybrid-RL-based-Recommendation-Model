# movies/serializers.py
from rest_framework import serializers
from .models import Movie, Actor, Director, Genre

class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = ['name']  # Assuming 'img' field exists

class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = ['name']

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['name']

class MovieSerializer(serializers.ModelSerializer):
    actors = ActorSerializer(many=True, read_only=True)
    directors = DirectorSerializer(many=True, read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    
    class Meta:
        model = Movie
        fields = ['id', 'imdb_id', 'original_title', 'overview', 'release_date', 'runtime',
                  'genres', 'directors', 'actors', 'working_poster_url', 'popularity_scaled', 'weighted_rating']
        extra_kwargs = {
            'imdb_id': {'required': False},
            'overview': {'required': False},
            'release_date': {'required': False}, 'runtime': {'required': False},
            'genres': {'required': False}, 'directors': {'required': False}, 'actors': {'required': False}, 'working_poster_url': {'required': False}, 'popularity_scaled': {'required': False}, 'weighted_rating': {'required': False},

            # Add similar lines for other fields that may not always be present
        }

