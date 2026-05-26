import jwt
import uuid
from datetime import datetime, timezone, timedelta
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
import requests as http_requests

User = get_user_model()

def make_access_token(user):
    payload = {
        "sub": user.id,
        "email": user.email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_EXPIRY_MINUTES),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def make_refresh_token(user):
    payload = {
        "sub": user.id,
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(days=settings.JWT_REFRESH_EXPIRY_DAYS),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def user_data(user):
    return {"id": user.id, "email": user.email, "name": user.name, "role": user.role}

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "")
    name = request.data.get("name", "").strip()
    role = request.data.get("role", "client")
    if not email or not password:
        return Response({"error": {"codigo": "VALIDACION_FALLIDA", "mensaje": "Email y contrasena son obligatorios"}}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({"error": {"codigo": "VALIDACION_FALLIDA", "mensaje": "Email ya registrado"}}, status=400)
    user = User.objects.create_user(email=email, name=name, password=password, role=role if role in ["client", "admin"] else "client")
    access = make_access_token(user)
    refresh = make_refresh_token(user)
    return Response({**user_data(user), "access": access, "refresh": refresh})

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password", "")
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": {"codigo": "TOKEN_INVALIDO", "mensaje": "Email o contrasena incorrectos"}}, status=401)
    if not user.check_password(password):
        return Response({"error": {"codigo": "TOKEN_INVALIDO", "mensaje": "Email o contrasena incorrectos"}}, status=401)
    access = make_access_token(user)
    refresh = make_refresh_token(user)
    return Response({**user_data(user), "access": access, "refresh": refresh})

@api_view(["POST"])
@permission_classes([AllowAny])
def google_auth(request):
    code = request.data.get("code", "")
    if not code:
        return Response({"error": {"codigo": "VALIDACION_FALLIDA", "mensaje": "Codigo de Google requerido"}}, status=400)
    token_resp = http_requests.post("https://oauth2.googleapis.com/token", data={
        "code": code,
        "client_id": settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
        "client_secret": settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
        "redirect_uri": request.data.get("redirect_uri", "http://localhost:3000"),
        "grant_type": "authorization_code",
    })
    if not token_resp.ok:
        return Response({"error": {"codigo": "TOKEN_INVALIDO", "mensaje": "No se pudo verificar con Google"}}, status=401)
    id_token = token_resp.json().get("id_token", "")
    user_info = http_requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}").json()
    email = user_info.get("email", "")
    name = user_info.get("name", "")
    if not email:
        return Response({"error": {"codigo": "TOKEN_INVALIDO", "mensaje": "No se pudo obtener email de Google"}}, status=401)
    user, _ = User.objects.get_or_create(email=email, defaults={"name": name, "role": "client"})
    if not user.name and name:
        user.name = name
        user.save()
    access = make_access_token(user)
    refresh = make_refresh_token(user)
    return Response({**user_data(user), "access": access, "refresh": refresh})

@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_token(request):
    token = request.data.get("refresh", "")
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise ValueError
        user = User.objects.get(id=payload["sub"])
        access = make_access_token(user)
        return Response({"access": access})
    except Exception:
        return Response({"error": {"codigo": "TOKEN_INVALIDO", "mensaje": "Refresh token invalido"}}, status=401)

@api_view(["POST"])
@permission_classes([AllowAny])
def logout(request):
    return Response({"ok": True})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(user_data(request.user))
