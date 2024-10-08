# Generated by Django 5.0.3 on 2024-04-04 09:19

import django.db.models.deletion
import interactions.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserPreference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('preferred_genres', models.JSONField(blank=True, default=interactions.models.default_preferences)),
                ('preferred_languages', models.JSONField(blank=True, default=interactions.models.default_preferences)),
                ('favorite_movies', models.JSONField(blank=True, default=interactions.models.default_preferences)),
                ('avoided_genres', models.JSONField(blank=True, default=interactions.models.default_preferences)),
                ('watch_frequency', models.JSONField(blank=True, default=interactions.models.default_preferences)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
