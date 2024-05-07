from django.urls import path
from .views import UserRegistrationView, UserLoginView, UserProfileView, UserPasswordUpdateView, UserProfilePictureUpdateView, UserSubscriptionView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user_register'),
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('profile/password/', UserPasswordUpdateView.as_view(), name='user_password_update'),
    path('profile/picture/', UserProfilePictureUpdateView.as_view(), name='user_profile_picture_update'),
    path('subscription/', UserSubscriptionView.as_view(), name='user_subscription'),
]
