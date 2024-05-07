# movies/views.py
import random
from django.apps import apps
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Genre, Movie
from .serializers import MovieSerializer
from django.http import Http404, JsonResponse
from interactions.models import UserPreference
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny

from .recommendations import combined_recommendations, filter_movies_for_each_genre
from .recommendations import recommend_unexplored_genres
from itertools import chain

class MoviesByGenreAPIView(APIView):
    def get(self, request, genre_name):
        genre = get_object_or_404(Genre, name__iexact=genre_name)
        # Fetch top 10 popular movies
        top_movies = Movie.objects.filter(genres=genre).order_by('-popularity_scaled')[:15]
        
        # Fetch 10 random movies from the remaining movies in the genre
        remaining_movies = Movie.objects.filter(genres=genre).exclude(id__in=top_movies.values_list('id', flat=True))
        random_movies = random.sample(list(remaining_movies), min(len(remaining_movies), 15))  # Ensure not to exceed the remaining count
        
        # Combine the lists
        movies = list(top_movies) + random_movies
        
        # Serialize and return the response
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

class MovieRecommendationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, genre_name):
        genre = get_object_or_404(Genre, name__iexact=genre_name)
        preferences, _ = UserPreference.objects.get_or_create(user=request.user)
        user_preferences = {
            'favorite_movie_titles': getattr(preferences, 'favorite_movies', []),
            'preferred_genres': [genre.name],
            'preferred_actors': getattr(preferences, 'preferred_actors', []),
            'preferred_directors': getattr(preferences, 'preferred_directors', []),
            'preferred_keywords': getattr(preferences, 'preferred_keywords', [])
        }

        recommendations = filter_movies_for_each_genre(user_preferences)  # Only genre-based recommendations

        serializer = MovieSerializer(list(recommendations.get(genre.name, [])), many=True)
        return Response(serializer.data)

from .serializers import MovieSerializer

class MovieDetailAPIView(APIView):
    def get(self, request, movie_id):
        try:
            movie = get_object_or_404(Movie, pk=movie_id)
            serializer = MovieSerializer(movie)
            return Response(serializer.data)
        except Http404:
            return JsonResponse({'error': 'Movie not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        

class UnexploredGenresAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        preferences, _ = UserPreference.objects.get_or_create(user=request.user)
        user_preferences = {
            'preferred_genres': getattr(preferences, 'preferred_genres', [])
        }
        
        # Fetch unexplored recommendations using the recommend_unexplored_genres function
        unexplored_recommendations = recommend_unexplored_genres(
            Movie.objects.all(),  # Fetch all movies
            apps.get_app_config('movies').genres_similarity_matrix,
            user_preferences['preferred_genres']
        )
        
        # Flatten the dictionary of lists into a single list of movie instances
        flat_list_of_movies = list(chain(*unexplored_recommendations.values()))

        # Serialize the flat list of movies
        serializer = MovieSerializer(flat_list_of_movies, many=True)
        return Response(serializer.data)