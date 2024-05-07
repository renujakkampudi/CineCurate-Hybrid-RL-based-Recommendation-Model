from django.test import TestCase
from .models import Movie, Genre, Actor, Director
from .recommendations import combined_recommendations, filter_movies_for_each_genre

class RecommendationTests(TestCase):
    def setUp(self):
        # Set up your test data here as before
        self.genre = Genre.objects.create(name='Action')
        self.actor = Actor.objects.create(name='Leonardo DiCaprio')
        self.director = Director.objects.create(name='Christopher Nolan')
        self.movie = Movie.objects.create(
            imdb_id='tt1375666',
            original_title='Inception',
            overview='A thief who steals corporate secrets through the use of dream-sharing technology...',
            release_date='2010-07-16',
            runtime=148,
            collection_name='Inception Collection',
            production_company_names='Warner Bros',
            keywords_list='dream, subconscious',
            release_year=2010,
            popularity_scaled=8.7,
            weighted_rating=8.8,
            working_poster_url='http://example.com/poster.png'
        )
        self.movie.genres.add(self.genre)
        self.movie.actors.add(self.actor)
        self.movie.directors.add(self.director)

        self.user_preferences = {
            'favorite_movie_titles': ['Inception'],
            'preferred_genres': ['Action'],
            'preferred_actors': ['Leonardo DiCaprio'],
            'preferred_directors': ['Christopher Nolan'],
            'preferred_keywords': ['dream']
        }

    def test_genre_based_recommendations(self):
        genre_recommendations = filter_movies_for_each_genre(self.user_preferences)
        self.assertIsNotNone(genre_recommendations, "Genre recommendations should not be None")
        self.assertIn('Action', genre_recommendations, "Should include recommendations for 'Action' genre")
        if 'Action' in genre_recommendations:
            self.assertTrue(len(genre_recommendations['Action']) > 0, "There should be at least one movie recommended for 'Action'")
            print("Test Genre-Based Recommendations Output:")
            for genre, movies in genre_recommendations.items():
                print(f"{genre}: {[movie.original_title for movie in movies]}")
                for movie in movies:
                    print(f"Movie: {movie.original_title}, Release Year: {movie.release_year}, Rating: {movie.weighted_rating}")




