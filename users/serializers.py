from django.contrib.auth import get_user_model
from django.forms import ValidationError
from rest_framework import serializers

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.exceptions import ValidationError

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Custom claims
        token['name'] = user.get_full_name()
        token['email'] = user.email

        return token

    def validate(self, attrs):
        # The default username_field for Django is 'username'. We override it.
        username_field = User.EMAIL_FIELD

        try:
            # Here we change 'email' to the actual field name defined in your User model.
            user = User.objects.get(email=attrs.get('email'))
            # Verification can be added here (e.g., is_active checks)

            # IMPORTANT: Set the username for the underlying TokenObtainPairSerializer
            attrs['username'] = user.username
        except User.DoesNotExist:
            raise serializers.ValidationError('No user found with this email')

        # Call super after modifying attrs to include the correct username
        return super().validate(attrs)



class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 'password', 'confirm_password', 'bio', 'avatar']

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError("Password and Confirm Password doesn't match.")
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'avatar', 'phone_number', 'address', 'subscription']

    def update(self, instance, validated_data):
        # Handle password change, if included
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class PasswordChangeSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords must match.")
        return data
