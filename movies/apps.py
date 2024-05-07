from django.apps import AppConfig
import numpy as np
import pickle

class MoviesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'movies'

    verbose_name = "Movies Application"

    # Paths to your files (adjust these paths as necessary)
    keyword_matrix_path = r"C:\Users\world\Desktop\VIT Materials\SEM 8\Capstone Project\main_movie_similarity_matrix_keywords.pkl"
    genre_matrix_path = r"C:\Users\world\Desktop\VIT Materials\SEM 8\Capstone Project\new_genres_similarity_matrix.npy"


    # Lazy-loaded properties
    _keyword_similarity_matrix = None
    _genres_similarity_matrix = None


    @property
    def keyword_similarity_matrix(self):
        if self._keyword_similarity_matrix is None:
            with open(self.keyword_matrix_path, 'rb') as file:
                self._keyword_similarity_matrix = pickle.load(file)
        return self._keyword_similarity_matrix

    @property
    def genres_similarity_matrix(self):
        if self._genres_similarity_matrix is None:
            self._genres_similarity_matrix = np.load(self.genre_matrix_path, allow_pickle=True)
        return self._genres_similarity_matrix
    
    
