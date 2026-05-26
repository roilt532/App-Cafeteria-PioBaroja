from datetime import datetime, timezone
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from bson import ObjectId

db = settings.MONGO_DB

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_inventory(request):
    if request.user.role != "admin":
        return Response({"error": {"codigo": "FORBIDDEN", "mensaje": "Sin permisos"}}, status=403)
    query = {}
    if request.query_params.get("stock_bajo") == "true":
        query["$expr"] = {"$lte": ["$stock", "$stock_minimo"]}
    products = list(db.products.find(query))
    return Response([{"id": str(p["_id"]), "nombre": p["nombre"], "stock": p["stock"], "stock_minimo": p["stock_minimo"], "disponible": p["disponible"], "precio": p["precio"], "categoria": p["categoria"]} for p in products])

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_inventory(request, product_id):
    if request.user.role != "admin":
        return Response({"error": {"codigo": "FORBIDDEN", "mensaje": "Sin permisos"}}, status=403)
    update = {}
    if "stock" in request.data:
        update["stock"] = request.data["stock"]
    if "disponible" in request.data:
        update["disponible"] = request.data["disponible"]
    if not update:
        return Response({"error": {"codigo": "VALIDACION_FALLIDA", "mensaje": "Sin datos"}}, status=400)
    db.products.update_one({"_id": ObjectId(product_id)}, {"$set": update})
    return Response({"ok": True})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_stats(request):
    if request.user.role != "admin":
        return Response({"error": {"codigo": "FORBIDDEN", "mensaje": "Sin permisos"}}, status=403)
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    all_orders = list(db.orders.find({}))
    today_orders = [o for o in all_orders if o.get("fecha") and o["fecha"].replace(tzinfo=timezone.utc) >= today]
    total_revenue = sum(o.get("total", 0) for o in all_orders if o.get("pagado"))
    today_revenue = sum(o.get("total", 0) for o in today_orders if o.get("pagado"))
    product_count = {}
    for o in all_orders:
        for item in o.get("items", []):
            n = item["nombre"]
            product_count[n] = product_count.get(n, 0) + item["cantidad"]
    top_product = max(product_count, key=product_count.get) if product_count else "-"
    low_stock = db.products.count_documents({"$expr": {"$lte": ["$stock", "$stock_minimo"]}})
    pending = db.orders.count_documents({"estado": {"$in": ["pendiente", "preparando"]}})
    estados = {"pendiente": 0, "preparando": 0, "listo": 0, "entregado": 0}
    for o in all_orders:
        if o.get("estado") in estados:
            estados[o["estado"]] += 1
    return Response({"fecha": today.strftime("%Y-%m-%d"), "pedidos_hoy": len(today_orders), "ingresos_hoy": round(today_revenue, 2), "pedidos_totales": len(all_orders), "ingresos_totales": round(total_revenue, 2), "ticket_medio": round(total_revenue / max(len(all_orders), 1), 2), "producto_mas_vendido": top_product, "productos_stock_bajo": low_stock, "pedidos_pendientes": pending, "estados": estados})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_top_products(request):
    if request.user.role != "admin":
        return Response({"error": {"codigo": "FORBIDDEN", "mensaje": "Sin permisos"}}, status=403)
    limite = int(request.query_params.get("limite", 10))
    orders = list(db.orders.find({"pagado": True}))
    product_count = {}
    product_revenue = {}
    for o in orders:
        for item in o.get("items", []):
            n = item["nombre"]
            product_count[n] = product_count.get(n, 0) + item["cantidad"]
            product_revenue[n] = product_revenue.get(n, 0) + item["precio"] * item["cantidad"]
    top = sorted(product_count.items(), key=lambda x: x[1], reverse=True)[:limite]
    return Response([{"nombre": n, "vendidos": c, "ingresos": round(product_revenue.get(n, 0), 2)} for n, c in top])
