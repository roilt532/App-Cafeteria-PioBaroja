from django.urls import path
from . import views

urlpatterns = [
    path("categorias/", views.get_categories),
    path("productos/", views.get_products),
    path("productos/<str:product_id>/", views.get_product),
    path("productos/<str:product_id>/update/", views.update_product),
    path("productos/<str:product_id>/delete/", views.delete_product),
]
