import uuid
from datetime import datetime, timezone
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from bson import ObjectId

db = settings.MONGO_DB

def serialize(doc):
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    return doc

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_orders(request):
    query = {"cliente_email": request.user.email}
    estado = request.query_params.get("estado")
    if estado:
        query["estado"] = estado
    orders = list(db.orders.find(query).sort("fecha", -1).limit(50))
    return Response([serialize(o) for o in orders])

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_admin_orders(request):
    if request.user.role != "admin":
        return Response({"error": {"codigo": "FORBIDDEN", "mensaje": "Sin permisos"}}, status=403)
    query = {}
    estado = request.query_params.get("estado")
    if estado:
        query["estado"] = estado
    orders = list(db.orders.find(query).sort("fecha", -1).limit(100))
    return Response([serialize(o) for o in orders])

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    items = request.data.get("items", [])
    franja_id = request.data.get("franja_horaria_id")
    if not items:
        return Response({"error": {"codigo": "VALIDACION_FALLIDA", "mensaje": "El pedido debe tener al menos un producto"}}, status=400)
    for item in items:
        prod = db.products.find_one({"_id": ObjectId(item["producto_id"])})
        if not prod:
            return Response({"error": {"codigo": "NO_ENCONTRADO", "mensaje": f"Producto no encontrado"}}, status=404)
        if prod["stock"] < item["cantidad"]:
            return Response({"error": {"codigo": "STOCK_INSUFICIENTE", "mensaje": f"'{prod['nombre']}' sin stock suficiente"}}, status=400)
    order_items = []
    total = 0
    for item in items:
        prod = db.products.find_one({"_id": ObjectId(item["producto_id"])})
        subtotal = prod["precio"] * item["cantidad"]
        order_items.append({"nombre": prod["nombre"], "cantidad": item["cantidad"], "precio": prod["precio"], "subtotal": round(subtotal, 2)})
        total += subtotal
        db.products.update_one({"_id": prod["_id"]}, {"$inc": {"stock": -item["cantidad"]}})
    franja = "10:00 - 10:30"
    if franja_id:
        slot = db.timeslots.find_one({"_id": ObjectId(franja_id)})
        if slot:
            franja = slot["hora"]
            db.timeslots.update_one({"_id": slot["_id"]}, {"$inc": {"ocupados": 1}})
    code = f"PB{uuid.uuid4().hex[:4].upper()}"
    order = {"codigo": code, "cliente_nombre": request.user.name, "cliente_email": request.user.email, "items": order_items, "total": round(total, 2), "estado": "pendiente_pago", "franja_horaria": franja, "pagado": False, "fecha": datetime.now(timezone.utc)}
    result = db.orders.insert_one(order)
    return Response({"id": str(result.inserted_id), "codigo": code, "total": round(total, 2), "franja_horaria": franja, "estado": "pendiente_pago", "items": order_items})

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    if request.user.role != "admin":
        return Response({"error": {"codigo": "FORBIDDEN", "mensaje": "Sin permisos"}}, status=403)
    new_status = request.data.get("estado")
    valid_transitions = {"pendiente_pago": ["pendiente", "pago_fallido"], "pendiente": ["preparando"], "preparando": ["listo"], "listo": ["entregado"]}
    order = db.orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        return Response({"error": {"codigo": "NO_ENCONTRADO", "mensaje": "Pedido no encontrado"}}, status=404)
    if new_status not in valid_transitions.get(order["estado"], []):
        return Response({"error": {"codigo": "TRANSICION_INVALIDA", "mensaje": f"No se puede pasar de '{order['estado']}' a '{new_status}'"}}, status=409)
    db.orders.update_one({"_id": ObjectId(order_id)}, {"$set": {"estado": new_status}})
    return Response({"ok": True, "estado": new_status})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def verify_order(request, codigo):
    if request.user.role != "admin":
        return Response({"error": {"codigo": "FORBIDDEN", "mensaje": "Sin permisos"}}, status=403)
    order = db.orders.find_one({"codigo": codigo.upper()})
    if not order:
        return Response({"error": {"codigo": "NO_ENCONTRADO", "mensaje": f"Pedido '{codigo}' no encontrado"}}, status=404)
    doc = order.copy()
    doc["id"] = str(doc.pop("_id"))
    return Response(doc)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_timeslots(request):
    slots = list(db.timeslots.find({}))
    return Response([{"id": str(s["_id"]), "hora": s["hora"], "disponible": s["ocupados"] < s["capacidad"], "capacidad": s["capacidad"], "ocupados": s["ocupados"]} for s in slots])
