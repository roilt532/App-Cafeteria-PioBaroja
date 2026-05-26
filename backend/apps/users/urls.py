from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register),
    path("login/", views.login),
    path("google/", views.google_auth),
    path("refresh/", views.refresh_token),
    path("logout/", views.logout),
    path("me/", views.me),
]
