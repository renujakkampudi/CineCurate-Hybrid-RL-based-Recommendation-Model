from django.urls import path, include
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CustomTokenObtainPairView
from movies.views import MovieRecommendationsAPIView, UnexploredGenresAPIView, MovieDetailAPIView, MoviesByGenreAPIView

urlpatterns = [
    path('users/', include('users.urls')),
    path('admin/', admin.site.urls),
    path('interactions/', include('interactions.urls')),
    path('movies/', include('movies.urls')),  # Include movies app URLs with 'movies/' prefix
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/recommendations/genre/<str:genre_name>/', MovieRecommendationsAPIView.as_view(), name='movie_recommendations_by_genre'),
    path('api/recommendations/explore-new-themes/', UnexploredGenresAPIView.as_view(), name='explore-unexplored-genres'),
    path('api/movies/<int:movie_id>/', MovieDetailAPIView.as_view(), name='movie-detail'),
    path('api/genres/<str:genre_name>/movies/', MoviesByGenreAPIView.as_view(), name='movies-by-genre'),
    # Other URLs
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

