# Assuming you have a urls.py in your movies app or project
from django.urls import path
from .views import MoviesByGenreAPIView, MovieRecommendationsAPIView, MovieDetailAPIView
from .views import UnexploredGenresAPIView

urlpatterns = [
    path('api/genres/<str:genre_name>/movies/', MoviesByGenreAPIView.as_view(), name='movies-by-genre'),
    path('api/recommendations/<str:genre_name>/', MovieRecommendationsAPIView.as_view(), name='movie_recommendations'),
    path('api/movies/<int:movie_id>/', MovieDetailAPIView.as_view(), name='movie-detail'),
    path('api/recommendations/explore-new-themes/', UnexploredGenresAPIView.as_view(), name='explore-unexplored-genres'),
]
