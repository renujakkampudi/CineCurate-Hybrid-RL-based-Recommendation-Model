import random
from django.apps import apps
from .models import Movie, Genre, Actor, Director
from django.db.models import Q
import numpy as np

def filter_movies_for_each_genre(user_preferences):
    genre_specific_recommendations = {}
    
    # User preferences
    preferred_genres = user_preferences['preferred_genres']
    preferred_actors = user_preferences['preferred_actors']
    preferred_directors = user_preferences['preferred_directors']

    for genre_name in preferred_genres:
        genre = Genre.objects.filter(name__iexact=genre_name).first()
        if not genre:
            continue
        
        # Query for "sticky" recommendations (e.g., top rated)
        sticky_movies = Movie.objects.filter(
            genres=genre,
            # Add any criteria for "sticky" recommendations
        ).order_by('-weighted_rating')[:20]  # Assume top 10 rated movies for the genre

        # Query for dynamic recommendations
        dynamic_movies = Movie.objects.filter(
            genres=genre
        ).exclude(
            id__in=sticky_movies.values_list('id', flat=True)
        ).order_by('?')[:10]  # Get 20 random movies, excluding sticky ones

        # Combining the results
        final_selection = list(sticky_movies) + list(dynamic_movies)

        genre_specific_recommendations[genre.name] = final_selection
        print(f"Recommendations for {genre.name}: {[movie.original_title for movie in final_selection]}")

    return genre_specific_recommendations

def recommend_unexplored_genres(movies_queryset, genres_similarity_matrix, preferred_genres, top_n_per_genre=20):
    # Extract unique genres from all movies
    unique_genres = set()
    for movie in movies_queryset:
        movie_genres = movie.genres.all()  # Using the ManyToMany relationship
        for genre in movie_genres:
            unique_genres.add(genre.name.lower())

    # Convert preferred genres to lowercase
    preferred_genres = [genre.lower() for genre in preferred_genres]

    # Ensure that genre names are indexed as expected
    genre_names = list(unique_genres)
    genre_indices = [genre_names.index(genre) for genre in preferred_genres if genre in genre_names]

    # Aggregate similarity scores for preferred genres
    unexplored_scores = np.zeros(len(genre_names))
    for index in genre_indices:
        unexplored_scores += genres_similarity_matrix[index]

    # Normalize scores
    unexplored_scores /= len(preferred_genres)

    # Identify indices of similar genres but not the same as preferred genres
    top_genre_indices = np.argsort(-unexplored_scores)[:len(genre_names)]
    similar_genres = [genre_names[i] for i in top_genre_indices if genre_names[i] not in preferred_genres]

    # Prepare dictionary to hold genre-specific recommendations
    genre_recommendations = {}
    for genre in similar_genres:
        genre_obj = Genre.objects.filter(name__iexact=genre).first()  # Fetch the Genre object case-insensitively
        if genre_obj:
            genre_movies = movies_queryset.filter(genres=genre_obj).order_by('-weighted_rating').distinct()[:top_n_per_genre]
            if genre_movies.exists():
                genre_recommendations[genre.capitalize()] = genre_movies

    return genre_recommendations


def keyword_based_recommendations(user_preferences, keyword_matrix):
    favorite_movie_titles = user_preferences['favorite_movie_titles']
    preferred_keywords = user_preferences['preferred_keywords']

    movie_ids = Movie.objects.filter(original_title__in=favorite_movie_titles).values_list('id', flat=True)
    movies = Movie.objects.all()
    aggregated_scores = np.zeros(len(movies))  # Ensure this is properly sized

    for movie_id in movie_ids:
        if movie_id < len(keyword_matrix):
            try:
                # Ensure adding correctly sized arrays
                aggregated_scores += keyword_matrix[movie_id, :]
            except ValueError as e:
                print(f"Error adding scores for movie_id {movie_id}: {e}")

    top_indices = np.argsort(-aggregated_scores)[:30]  # Adjust the number of recommendations as needed
    recommendations = Movie.objects.filter(id__in=top_indices)

    return recommendations

def process_user_interactions(df, preferred_genres, preferred_actors, preferred_directors, genres_similarity_matrix, similarity_matrices, content_based_recommendations, not_recommended):
    recommendations = {}
    for genre in preferred_genres:
        if genre in df['genre'].unique():
            genre_df = df[df['genre'] == genre]
            movie_ids = genre_df['movieId'].tolist()
            user_feedback = random.sample(movie_ids, min(5, len(movie_ids)))  # Sample some movies from the genre
            
            for movie_id in user_feedback:
                if movie_id in similarity_matrices['item-item'].index:
                    similar_movies = similarity_matrices['item-item'].loc[movie_id].nlargest(5)
                    recommendations[genre] = list(similar_movies.index)
    
    return recommendations

def extract_interactions(user_feedback):
    interactions = {}
    for feedback in user_feedback:
        movie_id, reaction = feedback
        if movie_id not in interactions:
            interactions[movie_id] = []
        interactions[movie_id].append(reaction)
    return interactions

def calculate_interaction_score(interactions, weights):
    score = 0
    for interaction in interactions:
        score += weights.get(interaction, 0)
    return score


def adjust_probabilities(match_count):
    base_prob = 0.1
    increment = 0.05 * match_count
    return min(1, base_prob + increment)

import numpy as np

def epsilon_greedy(similar_movie_ids, current_recommendations, interactions, not_recommended, preferred_actors, preferred_directors, preferred_genres, preferred_keywords, movie_details_df, epsilon=0.1):
    exploration = []
    exploitation = current_recommendations.copy()
    all_movie_ids = set(similar_movie_ids)

    for movie_id in all_movie_ids:
        if movie_id in not_recommended or movie_id in interactions:
            continue
        if np.random.rand() < epsilon:
            exploration.append(movie_id)
        else:
            exploitation.append(movie_id)

    new_recommendations = exploration + exploitation
    return new_recommendations[:15]  # Limit to top 15 recommendations

def dynamic_epsilon_greedy_update(similar_movie_ids, existing_recommendations, interactions, not_recommended, exploration_ids, exploitation_ids, interaction_limit=9, recommendation_limit=15):
    eligible_movies = [movie for movie in similar_movie_ids if movie not in existing_recommendations and movie not in not_recommended]
    new_interactions = np.random.choice(eligible_movies, size=min(len(eligible_movies), interaction_limit), replace=False)

    for movie_id in new_interactions:
        feedback_type = np.random.choice(['liked', 'disliked', 'neutral'], p=[0.4, 0.3, 0.3])
        interactions[movie_id] = feedback_type

    new_recommendations = epsilon_greedy(similar_movie_ids, existing_recommendations, interactions, not_recommended, None, None, None, None, None, 0.1)
    
    return new_recommendations, interactions

def combined_recommendations(user_preferences):
    config = apps.get_app_config('movies')
    genre_matrix = config.genres_similarity_matrix
    keyword_matrix = config.keyword_similarity_matrix

    genre_recommendations = filter_movies_for_each_genre(user_preferences)
    keyword_recommendations = keyword_based_recommendations(user_preferences, keyword_matrix)

    final_recommendations = {
        'Genre Specific': genre_recommendations,
        'Movies You Might Like': list(keyword_recommendations)
    }
    return final_recommendations
