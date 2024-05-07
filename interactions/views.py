# interactions/views.py

# interactions/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import UserPreference
from .serializers import UserPreferenceSerializer

class UserPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        preferences, created = UserPreference.objects.get_or_create(user=user)
        serializer = UserPreferenceSerializer(preferences)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        serializer = UserPreferenceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        user = request.user
        preferences, created = UserPreference.objects.get_or_create(user=user)
        serializer = UserPreferenceSerializer(preferences, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



