import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("access_token")
        if not token:
            auth = request.headers.get("Authorization", "")
            if auth.startswith("Bearer "):
                token = auth[7:]
        if not token:
            return None
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
            if payload.get("type") != "access":
                raise AuthenticationFailed("Token invalido")
            user = User.objects.get(id=payload["sub"])
            return (user, token)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expirado")
        except Exception:
            raise AuthenticationFailed("Token invalido")
