from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from bson import ObjectId

db = settings.MONGO_DB

def serialize(doc):
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc

@api_view(["GET"])
@permission_classes([AllowAny])
def get_categories(request):
    cats = list(db.categories.find({}, {"_id": 0}))
    return Response(cats)

@api_view(["GET"])
@permission_classes([AllowAny])
def get_products(request):
    query = {}
    categoria = request.query_params.get("categoria")
    search = request.query_params.get("search")
    saludable = request.query_params.get("saludable")
    if categoria and categoria != "all":
        query["categoria"] = categoria
    if search:
        query["nombre"] = {"$regex": search, "$options": "i"}
    if saludable == "true":
        query["saludable"] = True
    products = list(db.products.find(query))
    return Response([serialize(p) for p in products])

@api_view(["GET"])
@permission_classes([AllowAny])
def get_product(request, product_id):
    p = db.products.find_one({"_id": ObjectId(product_id)})
    if not p:
        return Response({"error": {"codigo": "NO_ENCONTRADO", "mensaje": "Producto no encontrado"}}, status=404)
    return Response(serialize(p))

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_product(request):
    if request.user.role != "admin":
        return Response({"error": {"codigo": "FORBIDDEN", "mensaje": "Sin permisos"}}, status=403)
    body = request.data
    result = db.products.insert_one({**body, "stock": body.get("stock", 10), "stock_minimo": body.get("stock_minimo", 5), "disponible": True})
    return Response({"id": str(result.inserted_id), "ok": True})

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_product(request, product_id):
    if request.user.role != "admin":
        return Response({"error": {"codigo": "FORBIDDEN", "mensaje": "Sin permisos"}}, status=403)
    body = {k: v for k, v in request.data.items() if k not in ("_id", "id")}
    db.products.update_one({"_id": ObjectId(product_id)}, {"$set": body})
    return Response({"ok": True})

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_product(request, product_id):
    if request.user.role != "admin":
        return Response({"error": {"codigo": "FORBIDDEN", "mensaje": "Sin permisos"}}, status=403)
    db.products.delete_one({"_id": ObjectId(product_id)})
    return Response({"ok": True})
