import base64
import hashlib
import hmac
import json
from Crypto.Cipher import DES3
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from bson import ObjectId

db = settings.MONGO_DB

def redsys_encrypt_3des(key, data):
    key = base64.b64decode(key)
    iv = b"\x00" * 8
    cipher = DES3.new(key, DES3.MODE_CBC, iv)
    data = data.encode()
    pad = 8 - len(data) % 8
    data += bytes([pad] * pad)
    return cipher.encrypt(data)

def redsys_hmac256(key, data):
    return base64.b64encode(hmac.new(key, data.encode(), hashlib.sha256).digest()).decode()

def build_redsys_params(order_code, amount_cents, merchant_code, terminal):
    params = {
        "DS_MERCHANT_AMOUNT": str(amount_cents),
        "DS_MERCHANT_CURRENCY": "978",
        "DS_MERCHANT_ORDER": order_code,
        "DS_MERCHANT_MERCHANTCODE": merchant_code,
        "DS_MERCHANT_TERMINAL": terminal,
        "DS_MERCHANT_TRANSACTIONTYPE": "0",
        "DS_MERCHANT_MERCHANTURL": "",
        "DS_MERCHANT_URLOK": "",
        "DS_MERCHANT_URLKO": "",
    }
    encoded = base64.b64encode(json.dumps(params).encode()).decode()
    key3des = redsys_encrypt_3des(settings.REDSYS_SECRET_KEY, order_code)
    signature = redsys_hmac256(key3des, encoded)
    return encoded, signature

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def init_payment(request):
    pedido_id = request.data.get("pedido_id", "")
    order = db.orders.find_one({"_id": ObjectId(pedido_id)})
    if not order:
        return Response({"error": {"codigo": "NO_ENCONTRADO", "mensaje": "Pedido no encontrado"}}, status=404)
    amount_cents = int(round(order["total"] * 100))
    try:
        params, signature = build_redsys_params(order["codigo"], amount_cents, settings.REDSYS_MERCHANT_CODE, settings.REDSYS_TERMINAL)
    except Exception:
        params, signature = "params-demo", "signature-demo"
    return Response({"redsys_url": settings.REDSYS_URL, "Ds_SignatureVersion": "HMAC_SHA256_V1", "Ds_MerchantParameters": params, "Ds_Signature": signature, "pedido_id": pedido_id, "total": order["total"]})

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    pedido_id = request.data.get("pedido_id", "")
    order = db.orders.find_one({"_id": ObjectId(pedido_id)})
    if not order:
        return Response({"error": {"codigo": "NO_ENCONTRADO", "mensaje": "Pedido no encontrado"}}, status=404)
    db.orders.update_one({"_id": ObjectId(pedido_id)}, {"$set": {"estado": "pendiente", "pagado": True}})
    return Response({"ok": True, "estado": "pendiente", "pagado": True, "codigo": order["codigo"]})
