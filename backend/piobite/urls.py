from django.urls import path, include

urlpatterns = [
    path("api/auth/", include("apps.users.urls")),
    path("api/", include("apps.catalog.urls")),
    path("api/", include("apps.orders.urls")),
    path("api/", include("apps.payments.urls")),
    path("api/", include("apps.inventory.urls")),
    path("social/", include("social_django.urls", namespace="social")),
]