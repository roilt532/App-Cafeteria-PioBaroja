from django.urls import path
from . import views

urlpatterns = [
    path("pagos/iniciar/", views.init_payment),
    path("pagos/confirmar/", views.confirm_payment),
]
