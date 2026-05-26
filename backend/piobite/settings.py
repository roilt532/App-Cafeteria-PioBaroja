import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-key-cambiar")
DEBUG = os.environ.get("DEBUG", "True") == "True"
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "rest_framework",
    "corsheaders",
    "social_django",
    "apps.users",
    "apps.catalog",
    "apps.orders",
    "apps.payments",
    "apps.inventory",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "social_django.middleware.SocialAuthExceptionMiddleware",
]

ROOT_URLCONF = "piobite.urls"
WSGI_APPLICATION = "piobite.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

import pymongo as _pymongo
MONGO_CLIENT = _pymongo.MongoClient(
    os.environ.get("MONGO_URL", "mongodb://localhost:27017")
)
MONGO_DB = MONGO_CLIENT[os.environ.get("DB_NAME", "piobite_cafeteria")]

AUTH_USER_MODEL = "users.User"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.users.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

AUTHENTICATION_BACKENDS = [
    "social_core.backends.google.GoogleOAuth2",
    "django.contrib.auth.backends.ModelBackend",
]

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ.get("GOOGLE_CLIENT_ID", "")
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ["email", "profile"]
SOCIAL_AUTH_PIPELINE = (
    "social_core.pipeline.social_auth.social_details",
    "social_core.pipeline.social_auth.social_uid",
    "social_core.pipeline.social_auth.social_user",
    "social_core.pipeline.user.get_username",
    "social_core.pipeline.user.create_user",
    "social_core.pipeline.social_auth.associate_user",
    "social_core.pipeline.social_auth.load_extra_data",
    "social_core.pipeline.user.user_details",
)

JWT_SECRET = os.environ.get("JWT_SECRET", "jwt-secret-cambiar")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_EXPIRY_MINUTES = 60
JWT_REFRESH_EXPIRY_DAYS = 7

CORS_ALLOW_ALL_ORIGINS = DEBUG
CORS_ALLOWED_ORIGINS = [
    os.environ.get("APP_URL", "http://localhost:3000"),
    "https://powerful-rejoicing-production-982d.up.railway.app",
]
CORS_ALLOW_CREDENTIALS = True

REDSYS_MERCHANT_CODE = os.environ.get("REDSYS_MERCHANT_CODE", "999008881")
REDSYS_TERMINAL = os.environ.get("REDSYS_TERMINAL", "1")
REDSYS_SECRET_KEY = os.environ.get("REDSYS_SECRET_KEY", "sq7HjrUOBfKmC576ILgskD5srU870gJ7")
REDSYS_URL = "https://sis-t.redsys.es:25443/sis/realizarPago"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
TEMPLATES = [{"BACKEND": "django.template.backends.django.DjangoTemplates", "DIRS": [], "APP_DIRS": True, "OPTIONS": {"context_processors": ["django.template.context_processors.request", "social_django.context_processors.backends", "social_django.context_processors.login_redirect"]}}]