from django.urls import path
from . import views

urlpatterns = [
    path("inventario/", views.get_inventory),
    path("inventario/<str:product_id>/", views.update_inventory),
    path("estadisticas/resumen/", views.get_stats),
    path("estadisticas/productos-top/", views.get_top_products),
]
