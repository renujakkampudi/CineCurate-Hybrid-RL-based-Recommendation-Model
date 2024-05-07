from django.db import models
from django.conf import settings
from django.db.models import JSONField

def default_preferences():
    return []

class UserPreference(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='userpreference')
    preferred_genres = JSONField(default=default_preferences, blank=True)
    preferred_actors = JSONField(default=default_preferences, blank=True)
    preferred_directors = JSONField(default=default_preferences, blank=True)
    favorite_movies = JSONField(default=default_preferences, blank=True)
    preferred_keywords = JSONField(default=default_preferences, blank=True)

    def __str__(self):
        return self.user.username + "'s Preferences"


