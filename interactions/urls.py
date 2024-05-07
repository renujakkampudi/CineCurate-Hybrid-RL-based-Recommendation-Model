# interactions/urls.py

from django.urls import path
from .views import UserPreferenceView

urlpatterns = [
    path('preferences/', UserPreferenceView.as_view(), name='user_preferences'),
]
