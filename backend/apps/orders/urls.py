from django.urls import path
from . import views

urlpatterns = [
    path("pedidos/", views.get_orders),
    path("pedidos/create/", views.create_order),
    path("pedidos/admin/", views.get_admin_orders),
    path("pedidos/<str:order_id>/estado/", views.update_order_status),
    path("pedidos/verificar/<str:codigo>/", views.verify_order),
    path("franjas-horarias/", views.get_timeslots),
]
