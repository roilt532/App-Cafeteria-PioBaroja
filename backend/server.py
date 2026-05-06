from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import motor.motor_asyncio
import bcrypt
import jwt
import os
import uuid
from datetime import datetime, timezone, timedelta
from bson import ObjectId

app = FastAPI(title="PíoBite API - Cafetería Pío Baroja")

FRONTEND_URL = os.environ.get("APP_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
JWT_SECRET = os.environ.get("JWT_SECRET")
JWT_ALGORITHM = "HS256"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ── Helpers ──────────────────────────────────────────

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    return jwt.encode({"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    return jwt.encode({"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}, JWT_SECRET, algorithm=JWT_ALGORITHM)

def serialize_doc(doc):
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc

def error_response(code: str, message: str, details=None, status=400):
    return JSONResponse(status_code=status, content={"error": {"codigo": code, "mensaje": message, "detalles": details}})

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token inválido")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except (jwt.InvalidTokenError, Exception):
        raise HTTPException(status_code=401, detail="Token inválido")

def require_role(user, role):
    if user.get("role") != role:
        raise HTTPException(status_code=403, detail="Permisos insuficientes")

# ── Seed Data ────────────────────────────────────────

SEED_CATEGORIES = [
    {"slug": "bocadillos", "nombre": "Bocadillos", "nombre_en": "Sandwiches", "icono": "sandwich"},
    {"slug": "bolleria", "nombre": "Bollería", "nombre_en": "Pastries", "icono": "croissant"},
    {"slug": "ensaladas", "nombre": "Ensaladas", "nombre_en": "Salads", "icono": "salad"},
    {"slug": "bebidas_calientes", "nombre": "Bebidas Calientes", "nombre_en": "Hot Drinks", "icono": "coffee"},
    {"slug": "bebidas_frias", "nombre": "Bebidas Frías", "nombre_en": "Cold Drinks", "icono": "cup-soda"},
]

SEED_PRODUCTS = [
    {"nombre": "Bocadillo de Jamón Serrano", "nombre_en": "Serrano Ham Sandwich", "precio": 3.50, "categoria": "bocadillos", "descripcion": "Pan crujiente con jamón serrano de calidad", "descripcion_en": "Crusty bread with quality Serrano ham", "imagen": "https://images.unsplash.com/photo-1544723295-b451ddfb68ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwyfHx0YXN0eSUyMGFydGlzYW4lMjBzYW5kd2ljaCUyMGJ1cmdlcnxlbnwwfHx8fDE3NzYyNDg4Mzl8MA&ixlib=rb-4.1.0&q=85", "saludable": False, "popular": True, "stock": 20, "stock_minimo": 5, "disponible": True},
    {"nombre": "Bocadillo de Tortilla", "nombre_en": "Spanish Omelette Sandwich", "precio": 3.00, "categoria": "bocadillos", "descripcion": "Tortilla española casera en pan de barra", "descripcion_en": "Homemade Spanish omelette in baguette", "imagen": "https://images.unsplash.com/photo-1762335753199-6d4af2053b34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwxfHx0YXN0eSUyMGFydGlzYW4lMjBzYW5kd2ljaCUyMGJ1cmdlcnxlbnwwfHx8fDE3NzYyNDg4Mzl8MA&ixlib=rb-4.1.0&q=85", "saludable": False, "popular": True, "stock": 18, "stock_minimo": 5, "disponible": True},
    {"nombre": "Croissant Mixto", "nombre_en": "Ham & Cheese Croissant", "precio": 2.50, "categoria": "bolleria", "descripcion": "Croissant relleno de jamón york y queso", "descripcion_en": "Croissant filled with ham and cheese", "imagen": "https://images.pexels.com/photos/30853716/pexels-photo-30853716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "saludable": False, "popular": True, "stock": 25, "stock_minimo": 8, "disponible": True},
    {"nombre": "Napolitana de Chocolate", "nombre_en": "Chocolate Pastry", "precio": 1.80, "categoria": "bolleria", "descripcion": "Napolitana crujiente con chocolate fundido", "descripcion_en": "Crispy pastry with melted chocolate", "imagen": "https://images.unsplash.com/photo-1737700088850-d0b53f9d39ec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MHx8fHwxNzc2MjQ4OTI2fDA&ixlib=rb-4.1.0&q=85", "saludable": False, "popular": False, "stock": 15, "stock_minimo": 5, "disponible": True},
    {"nombre": "Ensalada César", "nombre_en": "Caesar Salad", "precio": 4.50, "categoria": "ensaladas", "descripcion": "Lechuga, pollo, crutones, parmesano y salsa César", "descripcion_en": "Lettuce, chicken, croutons, parmesan and Caesar dressing", "imagen": "https://images.unsplash.com/photo-1622637103261-ae624e188bd0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHw0fHxmcmVzaCUyMGhlYWx0aHklMjBzYWxhZCUyMGJvd2x8ZW58MHx8fHwxNzc2MjQ4ODM5fDA&ixlib=rb-4.1.0&q=85", "saludable": True, "popular": False, "stock": 10, "stock_minimo": 3, "disponible": True},
    {"nombre": "Sandwich Vegetal", "nombre_en": "Veggie Sandwich", "precio": 3.20, "categoria": "bocadillos", "descripcion": "Pan integral con lechuga, tomate, huevo y atún", "descripcion_en": "Whole wheat bread with lettuce, tomato, egg and tuna", "imagen": "https://images.unsplash.com/photo-1762335753199-6d4af2053b34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NjV8MHwxfHNlYXJjaHwxfHx0YXN0eSUyMGFydGlzYW4lMjBzYW5kd2ljaCUyMGJ1cmdlcnxlbnwwfHx8fDE3NzYyNDg4Mzl8MA&ixlib=rb-4.1.0&q=85", "saludable": True, "popular": False, "stock": 12, "stock_minimo": 4, "disponible": True},
    {"nombre": "Café con Leche", "nombre_en": "Latte", "precio": 1.50, "categoria": "bebidas_calientes", "descripcion": "Café espresso con leche caliente", "descripcion_en": "Espresso with hot milk", "imagen": "https://images.unsplash.com/photo-1647972488473-ca3796499272?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxjb2ZmZWUlMjBwYXBlciUyMGN1cCUyMGNhZmV8ZW58MHx8fHwxNzc2MjQ4ODU3fDA&ixlib=rb-4.1.0&q=85", "saludable": False, "popular": True, "stock": 50, "stock_minimo": 10, "disponible": True},
    {"nombre": "Café Solo", "nombre_en": "Espresso", "precio": 1.20, "categoria": "bebidas_calientes", "descripcion": "Café espresso intenso", "descripcion_en": "Strong espresso coffee", "imagen": "https://images.unsplash.com/photo-1647972488473-ca3796499272?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxjb2ZmZWUlMjBwYXBlciUyMGN1cCUyMGNhZmV8ZW58MHx8fHwxNzc2MjQ4ODU3fDA&ixlib=rb-4.1.0&q=85", "saludable": False, "popular": False, "stock": 50, "stock_minimo": 10, "disponible": True},
    {"nombre": "Zumo de Naranja Natural", "nombre_en": "Fresh Orange Juice", "precio": 2.00, "categoria": "bebidas_frias", "descripcion": "Zumo de naranja recién exprimido", "descripcion_en": "Freshly squeezed orange juice", "imagen": "https://images.unsplash.com/photo-1759269106039-ffbe70b406fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG9yYW5nZSUyMGp1aWNlJTIwZ2xhc3MlMjBjYWZlfGVufDB8fHx8MTc3NjI0ODkxOHww&ixlib=rb-4.1.0&q=85", "saludable": True, "popular": True, "stock": 30, "stock_minimo": 8, "disponible": True},
    {"nombre": "Agua Mineral", "nombre_en": "Mineral Water", "precio": 1.00, "categoria": "bebidas_frias", "descripcion": "Botella de agua mineral 500ml", "descripcion_en": "500ml mineral water bottle", "imagen": "https://images.pexels.com/photos/1540235/pexels-photo-1540235.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "saludable": True, "popular": False, "stock": 40, "stock_minimo": 10, "disponible": True},
    {"nombre": "Batido de Chocolate", "nombre_en": "Chocolate Milkshake", "precio": 2.50, "categoria": "bebidas_frias", "descripcion": "Batido cremoso de chocolate con nata", "descripcion_en": "Creamy chocolate milkshake with cream", "imagen": "https://images.unsplash.com/photo-1648071597664-ffabc1e1c13b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBtaWxrc2hha2UlMjBzbW9vdGhpZXxlbnwwfHx8fDE3NzYyNDg5Mzh8MA&ixlib=rb-4.1.0&q=85", "saludable": False, "popular": True, "stock": 20, "stock_minimo": 5, "disponible": True},
    {"nombre": "Tostada con Tomate", "nombre_en": "Toast with Tomato", "precio": 1.80, "categoria": "bocadillos", "descripcion": "Tostada con aceite de oliva y tomate rallado", "descripcion_en": "Toast with olive oil and grated tomato", "imagen": "https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MHx8fHwxNzc2MjQ4OTI2fDA&ixlib=rb-4.1.0&q=85", "saludable": True, "popular": False, "stock": 15, "stock_minimo": 5, "disponible": True},
]

SEED_TIMESLOTS = [
    {"hora": "09:30 - 10:00", "capacidad": 10, "ocupados": 3},
    {"hora": "10:00 - 10:30", "capacidad": 10, "ocupados": 5},
    {"hora": "10:30 - 11:00", "capacidad": 10, "ocupados": 7},
    {"hora": "11:00 - 11:30", "capacidad": 10, "ocupados": 4},
    {"hora": "11:30 - 12:00", "capacidad": 10, "ocupados": 10},
    {"hora": "12:00 - 12:30", "capacidad": 10, "ocupados": 2},
    {"hora": "12:30 - 13:00", "capacidad": 10, "ocupados": 6},
    {"hora": "13:00 - 13:30", "capacidad": 10, "ocupados": 1},
]

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@piobite.es")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({"email": admin_email, "password_hash": hash_password(admin_password), "name": "Admin Cafetería", "role": "admin", "created_at": datetime.now(timezone.utc)})
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
    # Seed categories
    if await db.categories.count_documents({}) == 0:
        await db.categories.insert_many(SEED_CATEGORIES)
    # Seed products
    if await db.products.count_documents({}) == 0:
        await db.products.insert_many(SEED_PRODUCTS)
    # Seed timeslots
    if await db.timeslots.count_documents({}) == 0:
        await db.timeslots.insert_many(SEED_TIMESLOTS)
    # Seed sample orders for demo
    if await db.orders.count_documents({}) == 0:
        await db.orders.insert_many([
            {"codigo": "PB2401", "cliente_nombre": "María García", "cliente_email": "maria@piobaroja.es", "items": [{"nombre": "Bocadillo de Jamón Serrano", "cantidad": 1, "precio": 3.50}, {"nombre": "Café con Leche", "cantidad": 1, "precio": 1.50}], "total": 5.00, "estado": "entregado", "franja_horaria": "10:00 - 10:30", "pagado": True, "fecha": datetime(2025, 4, 14, tzinfo=timezone.utc)},
            {"codigo": "PB2402", "cliente_nombre": "Carlos López", "cliente_email": "carlos@piobaroja.es", "items": [{"nombre": "Ensalada César", "cantidad": 1, "precio": 4.50}, {"nombre": "Zumo de Naranja", "cantidad": 1, "precio": 2.00}], "total": 6.50, "estado": "preparando", "franja_horaria": "11:00 - 11:30", "pagado": True, "fecha": datetime(2025, 4, 15, tzinfo=timezone.utc)},
            {"codigo": "PB2403", "cliente_nombre": "Ana Martínez", "cliente_email": "ana@piobaroja.es", "items": [{"nombre": "Croissant Mixto", "cantidad": 2, "precio": 2.50}], "total": 5.00, "estado": "pendiente", "franja_horaria": "09:30 - 10:00", "pagado": True, "fecha": datetime(2025, 4, 15, tzinfo=timezone.utc)},
            {"codigo": "PB2404", "cliente_nombre": "Pedro Sánchez", "cliente_email": "pedro@piobaroja.es", "items": [{"nombre": "Café con Leche", "cantidad": 1, "precio": 1.50}, {"nombre": "Napolitana de Chocolate", "cantidad": 1, "precio": 1.80}], "total": 3.30, "estado": "listo", "franja_horaria": "10:30 - 11:00", "pagado": True, "fecha": datetime(2025, 4, 15, tzinfo=timezone.utc)},
        ])
    # Write test credentials
    import os as _os
    _os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials - PíoBite\n\n")
        f.write(f"## Admin\n- Email: {admin_email}\n- Password: {admin_password}\n- Role: admin\n\n")
        f.write("## Test Client\n- Email: test@piobaroja.es\n- Password: test123\n- Role: client (register first)\n\n")
        f.write("## Auth Endpoints\n- POST /api/auth/register\n- POST /api/auth/login\n- POST /api/auth/logout\n- GET /api/auth/me\n- POST /api/auth/refresh\n")


# ── Health ───────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "app": "PíoBite API", "version": "2.0.0"}


# ── Auth ─────────────────────────────────────────────

@app.post("/api/auth/register")
async def register(request: Request):
    body = await request.json()
    name = body.get("name", "").strip()
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")
    role = body.get("role", "client")
    if not email or not password:
        return error_response("VALIDACION_FALLIDA", "Email y contraseña son obligatorios")
    if await db.users.find_one({"email": email}):
        return error_response("VALIDACION_FALLIDA", "Este email ya está registrado")
    result = await db.users.insert_one({"email": email, "password_hash": hash_password(password), "name": name or "Usuario", "role": role if role in ["client", "admin"] else "client", "created_at": datetime.now(timezone.utc)})
    user_id = str(result.inserted_id)
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    resp = JSONResponse(content={"id": user_id, "email": email, "name": name, "role": role, "access": access, "refresh": refresh})
    resp.set_cookie("access_token", access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    resp.set_cookie("refresh_token", refresh, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return resp

@app.post("/api/auth/login")
async def login(request: Request):
    body = await request.json()
    email = body.get("email", "").strip().lower()
    password = body.get("password", "")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password_hash"]):
        return error_response("TOKEN_INVALIDO", "Email o contraseña incorrectos", status=401)
    user_id = str(user["_id"])
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    resp = JSONResponse(content={"id": user_id, "email": user["email"], "name": user["name"], "role": user["role"], "access": access, "refresh": refresh})
    resp.set_cookie("access_token", access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    resp.set_cookie("refresh_token", refresh, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return resp

@app.post("/api/auth/logout")
async def logout():
    resp = JSONResponse(content={"ok": True})
    resp.delete_cookie("access_token", path="/")
    resp.delete_cookie("refresh_token", path="/")
    return resp

@app.get("/api/auth/me")
async def me(user=Depends(get_current_user)):
    return user

@app.post("/api/auth/refresh")
async def refresh(request: Request):
    token = request.cookies.get("refresh_token")
    if not token:
        body = await request.json()
        token = body.get("refresh")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access = create_access_token(str(user["_id"]), user["email"])
        resp = JSONResponse(content={"access": access})
        resp.set_cookie("access_token", access, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
        return resp
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


# ── Categories ───────────────────────────────────────

@app.get("/api/categorias")
async def get_categories():
    cats = await db.categories.find({}, {"_id": 0}).to_list(50)
    return cats


# ── Products ─────────────────────────────────────────

@app.get("/api/productos")
async def get_products(categoria: str = None, search: str = None, saludable: str = None):
    query = {}
    if categoria and categoria != "all":
        query["categoria"] = categoria
    if search:
        query["nombre"] = {"$regex": search, "$options": "i"}
    if saludable == "true":
        query["saludable"] = True
    products = await db.products.find(query).to_list(100)
    return [serialize_doc(p) for p in products]

@app.get("/api/productos/{product_id}")
async def get_product(product_id: str):
    p = await db.products.find_one({"_id": ObjectId(product_id)})
    if not p:
        return error_response("NO_ENCONTRADO", "Producto no encontrado", status=404)
    return serialize_doc(p)

@app.post("/api/productos")
async def create_product(request: Request, user=Depends(get_current_user)):
    require_role(user, "admin")
    body = await request.json()
    result = await db.products.insert_one({**body, "stock": body.get("stock", 10), "stock_minimo": body.get("stock_minimo", 5), "disponible": True})
    return {"id": str(result.inserted_id), "ok": True}

@app.put("/api/productos/{product_id}")
async def update_product(product_id: str, request: Request, user=Depends(get_current_user)):
    require_role(user, "admin")
    body = await request.json()
    body.pop("_id", None)
    body.pop("id", None)
    await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": body})
    return {"ok": True}

@app.delete("/api/productos/{product_id}")
async def delete_product(product_id: str, user=Depends(get_current_user)):
    require_role(user, "admin")
    await db.products.delete_one({"_id": ObjectId(product_id)})
    return {"ok": True}


# ── Time Slots ───────────────────────────────────────

@app.get("/api/franjas-horarias")
async def get_timeslots():
    slots = await db.timeslots.find({}).to_list(20)
    return [{"id": str(s["_id"]), "hora": s["hora"], "disponible": s["ocupados"] < s["capacidad"], "capacidad": s["capacidad"], "ocupados": s["ocupados"]} for s in slots]


# ── Orders ───────────────────────────────────────────

@app.get("/api/pedidos")
async def get_orders(user=Depends(get_current_user), estado: str = None):
    query = {"cliente_email": user["email"]}
    if estado:
        query["estado"] = estado
    orders = await db.orders.find(query).sort("fecha", -1).to_list(50)
    return [serialize_doc(o) for o in orders]

@app.get("/api/pedidos/admin")
async def get_admin_orders(user=Depends(get_current_user), estado: str = None, fecha: str = None):
    require_role(user, "admin")
    query = {}
    if estado:
        query["estado"] = estado
    orders = await db.orders.find(query).sort("fecha", -1).to_list(100)
    return [serialize_doc(o) for o in orders]

@app.post("/api/pedidos")
async def create_order(request: Request, user=Depends(get_current_user)):
    body = await request.json()
    items = body.get("items", [])
    franja_id = body.get("franja_horaria_id")
    if not items:
        return error_response("VALIDACION_FALLIDA", "El pedido debe tener al menos un producto")
    # Validate stock
    for item in items:
        prod = await db.products.find_one({"_id": ObjectId(item["producto_id"])})
        if not prod:
            return error_response("NO_ENCONTRADO", f"Producto {item['producto_id']} no encontrado", status=404)
        if prod["stock"] < item["cantidad"]:
            return error_response("STOCK_INSUFICIENTE", f"'{prod['nombre']}' sin stock suficiente (disponible: {prod['stock']})")
    # Build order
    order_items = []
    total = 0
    for item in items:
        prod = await db.products.find_one({"_id": ObjectId(item["producto_id"])})
        subtotal = prod["precio"] * item["cantidad"]
        order_items.append({"nombre": prod["nombre"], "cantidad": item["cantidad"], "precio": prod["precio"], "subtotal": round(subtotal, 2)})
        total += subtotal
        await db.products.update_one({"_id": prod["_id"]}, {"$inc": {"stock": -item["cantidad"]}})
    franja = "10:00 - 10:30"
    if franja_id:
        slot = await db.timeslots.find_one({"_id": ObjectId(franja_id)})
        if slot:
            franja = slot["hora"]
            await db.timeslots.update_one({"_id": slot["_id"]}, {"$inc": {"ocupados": 1}})
    code = f"PB{uuid.uuid4().hex[:4].upper()}"
    order = {"codigo": code, "cliente_nombre": user["name"], "cliente_email": user["email"], "items": order_items, "total": round(total, 2), "estado": "pendiente_pago", "franja_horaria": franja, "pagado": False, "fecha": datetime.now(timezone.utc)}
    result = await db.orders.insert_one(order)
    return {"id": str(result.inserted_id), "codigo": code, "total": round(total, 2), "franja_horaria": franja, "estado": "pendiente_pago", "items": order_items}

@app.patch("/api/pedidos/{order_id}/estado")
async def update_order_status(order_id: str, request: Request, user=Depends(get_current_user)):
    require_role(user, "admin")
    body = await request.json()
    new_status = body.get("estado")
    valid_transitions = {"pendiente_pago": ["pendiente", "pago_fallido"], "pendiente": ["preparando"], "preparando": ["listo"], "listo": ["entregado"]}
    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        return error_response("NO_ENCONTRADO", "Pedido no encontrado", status=404)
    allowed = valid_transitions.get(order["estado"], [])
    if new_status not in allowed:
        return error_response("TRANSICION_INVALIDA", f"No se puede pasar de '{order['estado']}' a '{new_status}'", status=409)
    await db.orders.update_one({"_id": ObjectId(order_id)}, {"$set": {"estado": new_status}})
    return {"ok": True, "estado": new_status}

@app.get("/api/pedidos/verificar/{codigo}")
async def verify_order(codigo: str, user=Depends(get_current_user)):
    require_role(user, "admin")
    order = await db.orders.find_one({"codigo": codigo.upper()})
    if not order:
        return error_response("NO_ENCONTRADO", f"Pedido con código '{codigo}' no encontrado", status=404)
    return serialize_doc(order)


# ── Payments (Redsys Simulation) ─────────────────────

@app.post("/api/pagos/iniciar")
async def init_payment(request: Request, user=Depends(get_current_user)):
    body = await request.json()
    pedido_id = body.get("pedido_id")
    order = await db.orders.find_one({"_id": ObjectId(pedido_id)})
    if not order:
        return error_response("NO_ENCONTRADO", "Pedido no encontrado", status=404)
    return {"redsys_url": "https://sis-t.redsys.es:25443/sis/realizarPago", "Ds_SignatureVersion": "HMAC_SHA256_V1", "Ds_MerchantParameters": "eyJEc19NZXJjaGFudF9Nb2Rl...", "Ds_Signature": "qWgR7bKpP0n9M1dGK3...", "pedido_id": str(order["_id"]), "total": order["total"], "simulado": True}

@app.post("/api/pagos/confirmar")
async def confirm_payment(request: Request, user=Depends(get_current_user)):
    body = await request.json()
    pedido_id = body.get("pedido_id")
    order = await db.orders.find_one({"_id": ObjectId(pedido_id)})
    if not order:
        return error_response("NO_ENCONTRADO", "Pedido no encontrado", status=404)
    await db.orders.update_one({"_id": ObjectId(pedido_id)}, {"$set": {"estado": "pendiente", "pagado": True}})
    return {"ok": True, "estado": "pendiente", "pagado": True, "codigo": order["codigo"]}


# ── Inventory ────────────────────────────────────────

@app.get("/api/inventario")
async def get_inventory(user=Depends(get_current_user), stock_bajo: str = None):
    require_role(user, "admin")
    query = {}
    if stock_bajo == "true":
        query["$expr"] = {"$lte": ["$stock", "$stock_minimo"]}
    products = await db.products.find(query).to_list(100)
    return [{"id": str(p["_id"]), "nombre": p["nombre"], "stock": p["stock"], "stock_minimo": p["stock_minimo"], "disponible": p["disponible"], "precio": p["precio"], "categoria": p["categoria"]} for p in products]

@app.patch("/api/inventario/{product_id}")
async def update_inventory(product_id: str, request: Request, user=Depends(get_current_user)):
    require_role(user, "admin")
    body = await request.json()
    update = {}
    if "stock" in body:
        update["stock"] = body["stock"]
    if "disponible" in body:
        update["disponible"] = body["disponible"]
    if not update:
        return error_response("VALIDACION_FALLIDA", "No hay datos para actualizar")
    await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": update})
    return {"ok": True}


# ── Statistics ───────────────────────────────────────

@app.get("/api/estadisticas/resumen")
async def get_stats_summary(user=Depends(get_current_user)):
    require_role(user, "admin")
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    all_orders = await db.orders.find({}).to_list(500)
    today_orders = [o for o in all_orders if o.get("fecha") and o["fecha"].replace(tzinfo=timezone.utc) >= today]
    total_orders = len(all_orders)
    total_revenue = sum(o.get("total", 0) for o in all_orders if o.get("pagado"))
    today_count = len(today_orders)
    today_revenue = sum(o.get("total", 0) for o in today_orders if o.get("pagado"))
    ticket_medio = round(total_revenue / max(total_orders, 1), 2)
    # Most sold product
    product_count = {}
    for o in all_orders:
        for item in o.get("items", []):
            name = item["nombre"]
            product_count[name] = product_count.get(name, 0) + item["cantidad"]
    top_product = max(product_count, key=product_count.get) if product_count else "—"
    # Low stock count
    low_stock = await db.products.count_documents({"$expr": {"$lte": ["$stock", "$stock_minimo"]}})
    # Pending orders
    pending = await db.orders.count_documents({"estado": {"$in": ["pendiente", "preparando"]}})
    # Status breakdown
    estados = {"pendiente": 0, "preparando": 0, "listo": 0, "entregado": 0}
    for o in all_orders:
        if o.get("estado") in estados:
            estados[o["estado"]] += 1
    return {"fecha": today.strftime("%Y-%m-%d"), "pedidos_hoy": today_count, "ingresos_hoy": round(today_revenue, 2), "pedidos_totales": total_orders, "ingresos_totales": round(total_revenue, 2), "ticket_medio": ticket_medio, "producto_mas_vendido": top_product, "productos_stock_bajo": low_stock, "pedidos_pendientes": pending, "estados": estados}

@app.get("/api/estadisticas/productos-top")
async def get_top_products(user=Depends(get_current_user), limite: int = 10):
    require_role(user, "admin")
    orders = await db.orders.find({"pagado": True}).to_list(500)
    product_count = {}
    product_revenue = {}
    for o in orders:
        for item in o.get("items", []):
            name = item["nombre"]
            product_count[name] = product_count.get(name, 0) + item["cantidad"]
            product_revenue[name] = product_revenue.get(name, 0) + item["precio"] * item["cantidad"]
    top = sorted(product_count.items(), key=lambda x: x[1], reverse=True)[:limite]
    return [{"nombre": name, "vendidos": count, "ingresos": round(product_revenue.get(name, 0), 2)} for name, count in top]
