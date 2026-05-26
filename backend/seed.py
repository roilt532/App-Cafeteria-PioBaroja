import os
from dotenv import load_dotenv
import pymongo
from datetime import datetime, timezone

load_dotenv()
client = pymongo.MongoClient(os.environ.get("MONGO_URL", "mongodb://localhost:27017"))
db = client[os.environ.get("DB_NAME", "piobite_cafeteria")]

if db.categories.count_documents({}) == 0:
    db.categories.insert_many([
        {"slug": "bocadillos", "nombre": "Bocadillos", "nombre_en": "Sandwiches", "icono": "sandwich"},
        {"slug": "bolleria", "nombre": "Bolleria", "nombre_en": "Pastries", "icono": "croissant"},
        {"slug": "ensaladas", "nombre": "Ensaladas", "nombre_en": "Salads", "icono": "salad"},
        {"slug": "bebidas_calientes", "nombre": "Bebidas Calientes", "nombre_en": "Hot Drinks", "icono": "coffee"},
        {"slug": "bebidas_frias", "nombre": "Bebidas Frias", "nombre_en": "Cold Drinks", "icono": "cup-soda"},
    ])
    print("Categorias insertadas")

if db.products.count_documents({}) == 0:
    db.products.insert_many([
        {"nombre": "Bocadillo de Jamon Serrano", "nombre_en": "Serrano Ham Sandwich", "precio": 3.50, "categoria": "bocadillos", "descripcion": "Pan crujiente con jamon serrano", "descripcion_en": "Crusty bread with Serrano ham", "imagen": "https://images.unsplash.com/photo-1544723295-b451ddfb68ae?w=400", "saludable": False, "popular": True, "stock": 20, "stock_minimo": 5, "disponible": True},
        {"nombre": "Bocadillo de Tortilla", "nombre_en": "Spanish Omelette Sandwich", "precio": 3.00, "categoria": "bocadillos", "descripcion": "Tortilla espanola casera en pan de barra", "descripcion_en": "Homemade Spanish omelette in baguette", "imagen": "https://images.unsplash.com/photo-1762335753199-6d4af2053b34?w=400", "saludable": False, "popular": True, "stock": 18, "stock_minimo": 5, "disponible": True},
        {"nombre": "Croissant Mixto", "nombre_en": "Ham & Cheese Croissant", "precio": 2.50, "categoria": "bolleria", "descripcion": "Croissant relleno de jamon york y queso", "descripcion_en": "Croissant filled with ham and cheese", "imagen": "https://images.pexels.com/photos/30853716/pexels-photo-30853716.jpeg?w=400", "saludable": False, "popular": True, "stock": 25, "stock_minimo": 8, "disponible": True},
        {"nombre": "Napolitana de Chocolate", "nombre_en": "Chocolate Pastry", "precio": 1.80, "categoria": "bolleria", "descripcion": "Napolitana crujiente con chocolate", "descripcion_en": "Crispy pastry with chocolate", "imagen": "https://images.unsplash.com/photo-1737700088850-d0b53f9d39ec?w=400", "saludable": False, "popular": False, "stock": 15, "stock_minimo": 5, "disponible": True},
        {"nombre": "Ensalada Cesar", "nombre_en": "Caesar Salad", "precio": 4.50, "categoria": "ensaladas", "descripcion": "Lechuga, pollo, crutones y salsa Cesar", "descripcion_en": "Lettuce, chicken, croutons and Caesar dressing", "imagen": "https://images.unsplash.com/photo-1622637103261-ae624e188bd0?w=400", "saludable": True, "popular": False, "stock": 10, "stock_minimo": 3, "disponible": True},
        {"nombre": "Cafe con Leche", "nombre_en": "Latte", "precio": 1.50, "categoria": "bebidas_calientes", "descripcion": "Cafe espresso con leche caliente", "descripcion_en": "Espresso with hot milk", "imagen": "https://images.unsplash.com/photo-1647972488473-ca3796499272?w=400", "saludable": False, "popular": True, "stock": 50, "stock_minimo": 10, "disponible": True},
        {"nombre": "Cafe Solo", "nombre_en": "Espresso", "precio": 1.20, "categoria": "bebidas_calientes", "descripcion": "Cafe espresso intenso", "descripcion_en": "Strong espresso coffee", "imagen": "https://images.unsplash.com/photo-1647972488473-ca3796499272?w=400", "saludable": False, "popular": False, "stock": 50, "stock_minimo": 10, "disponible": True},
        {"nombre": "Zumo de Naranja Natural", "nombre_en": "Fresh Orange Juice", "precio": 2.00, "categoria": "bebidas_frias", "descripcion": "Zumo de naranja recien exprimido", "descripcion_en": "Freshly squeezed orange juice", "imagen": "https://images.unsplash.com/photo-1759269106039-ffbe70b406fb?w=400", "saludable": True, "popular": True, "stock": 30, "stock_minimo": 8, "disponible": True},
        {"nombre": "Agua Mineral", "nombre_en": "Mineral Water", "precio": 1.00, "categoria": "bebidas_frias", "descripcion": "Botella de agua mineral 500ml", "descripcion_en": "500ml mineral water bottle", "imagen": "https://images.pexels.com/photos/1540235/pexels-photo-1540235.jpeg?w=400", "saludable": True, "popular": False, "stock": 40, "stock_minimo": 10, "disponible": True},
        {"nombre": "Batido de Chocolate", "nombre_en": "Chocolate Milkshake", "precio": 2.50, "categoria": "bebidas_frias", "descripcion": "Batido cremoso de chocolate con nata", "descripcion_en": "Creamy chocolate milkshake with cream", "imagen": "https://images.unsplash.com/photo-1648071597664-ffabc1e1c13b?w=400", "saludable": False, "popular": True, "stock": 20, "stock_minimo": 5, "disponible": True},
    ])
    print("Productos insertados")

if db.timeslots.count_documents({}) == 0:
    db.timeslots.insert_many([
        {"hora": "09:30 - 10:00", "capacidad": 10, "ocupados": 0},
        {"hora": "10:00 - 10:30", "capacidad": 10, "ocupados": 0},
        {"hora": "10:30 - 11:00", "capacidad": 10, "ocupados": 0},
        {"hora": "11:00 - 11:30", "capacidad": 10, "ocupados": 0},
        {"hora": "11:30 - 12:00", "capacidad": 10, "ocupados": 10},
        {"hora": "12:00 - 12:30", "capacidad": 10, "ocupados": 0},
        {"hora": "12:30 - 13:00", "capacidad": 10, "ocupados": 0},
        {"hora": "13:00 - 13:30", "capacidad": 10, "ocupados": 0},
    ])
    print("Franjas horarias insertadas")

print("Seed completado")
