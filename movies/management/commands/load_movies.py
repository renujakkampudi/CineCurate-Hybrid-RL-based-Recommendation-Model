from django.core.management.base import BaseCommand, CommandError
import pickle
from datetime import datetime, date
from movies.models import Movie, Genre, Actor, Director
import os

class Command(BaseCommand):
    help = 'Loads movie data from a pickle file into the database'

    def add_arguments(self, parser):
        # Name of the pickle file as an argument
        parser.add_argument('file_path', type=str, help='The path to the pickle file containing the movie data')

    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']
        file_path = file_path.replace('\\', '\\\\')  # Adjust for Windows path if necessary
        try:
            with open(file_path, 'rb') as file:
                data = pickle.load(file)
                for item in data.itertuples(index=False):

                    try:
                        runtime = int(float(item.runtime)) if item.runtime else 0  # Use 0 (or another default value) instead of None
                    except ValueError:
                        runtime = 0
                
                    # Check if item.release_date is already a datetime.date instance
                    if isinstance(item.release_date, date):
                        release_date = item.release_date
                    else:
                        release_date = datetime.strptime(item.release_date, '%Y-%m-%d').date() if item.release_date else None

                    movie, created = Movie.objects.get_or_create(
                        imdb_id=item.imdb_id,
                        defaults={
                            'original_title': item.original_title,
                            'overview': item.overview,
                            'release_date': release_date,  # Use the release_date determined above
                            'runtime': runtime,
                            'collection_name': item.collection_name,
                            'production_company_names': ','.join(item.production_company_names) if item.production_company_names else '',
                            'keywords_list': ','.join(item.keywords_list) if item.keywords_list else '',
                            'release_year': item.release_year,
                            'popularity_scaled': item.popularity_scaled,
                            'weighted_rating': item.weighted_rating,
                            'working_poster_url': item.working_poster_url,
                        }
                    )

                    # Handle genres
                    for genre_name in getattr(item, 'genre_names', []) or []:
                        genre, _ = Genre.objects.get_or_create(name=genre_name)
                        movie.genres.add(genre)

                    # Handle actors
                    actor_names = getattr(item, 'actor_names', None) or []  # Ensure it's not None
                    for actor_name in actor_names:
                        actor, _ = Actor.objects.get_or_create(name=actor_name)
                        movie.actors.add(actor)

                    # Handle directors
                    director_names = getattr(item, 'directors', None) or []  # Ensure it's not None
                    for director_name in director_names:
                        director, _ = Director.objects.get_or_create(name=director_name)
                        movie.directors.add(director)

                    self.stdout.write(self.style.SUCCESS(f'Loaded movie: "{movie.original_title}"'))
        except FileNotFoundError:
            raise CommandError(f'The file "{file_path}" does not exist.')
