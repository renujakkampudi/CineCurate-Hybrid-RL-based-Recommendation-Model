from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Actor(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Director(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Movie(models.Model):
    imdb_id = models.CharField(max_length=20, unique=True)
    original_title = models.CharField(max_length=255)
    overview = models.TextField()
    release_date = models.DateField()
    runtime = models.IntegerField(null=True, blank=True) 
    collection_name = models.CharField(max_length=255, null=True, blank=True)
    genres = models.ManyToManyField(Genre)
    production_company_names = models.TextField()
    keywords_list = models.TextField()
    actors = models.ManyToManyField(Actor)
    directors = models.ManyToManyField(Director)
    writers = models.TextField()
    producers = models.TextField()
    release_year = models.IntegerField()
    popularity_scaled = models.FloatField()
    weighted_rating = models.FloatField()
    working_poster_url = models.URLField(max_length=1024)

    def __str__(self):
        return self.original_title


