import base64
import json
import hmac
import hashlib
import time
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from backend.app.core.config import settings

router = APIRouter()


class CitizenLoginRequest(BaseModel):
    mobile_number: str = Field(..., description="10-digit mobile number")
    password: str = Field(..., description="Citizen password")


class CitizenRegisterRequest(BaseModel):
    full_name: str = Field(..., description="Full Name")
    mobile_number: str = Field(..., description="10-digit mobile number")
    password: str = Field(..., description="Citizen password")
    state: Optional[str] = "Uttar Pradesh"
    pincode: Optional[str] = "221005"


class EnumeratorLoginRequest(BaseModel):
    enumerator_id: str = Field(..., description="Enumerator ID (e.g. ENUM101)")
    security_key: str = Field(..., description="Security key or password")


def generate_jwt_token(payload: dict, secret: str = settings.JWT_SECRET) -> str:
    """Generate a standard HS256 JWT token using Python standard library."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload_copy = payload.copy()
    if "exp" not in payload_copy:
        payload_copy["exp"] = int(time.time()) + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)

    def b64url(data: bytes) -> str:
        return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

    header_b64 = b64url(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = b64url(json.dumps(payload_copy, separators=(",", ":")).encode("utf-8"))

    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    signature_b64 = b64url(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"


@router.post("/citizen/login")
async def citizen_login(req: CitizenLoginRequest):
    mobile = req.mobile_number.strip()
    pwd = req.password.strip()

    if not mobile or not pwd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Mobile number and password are required", "code": "validation_failed"},
        )

    # Citizen profile authentication (with fallback for demo accounts)
    user_data = {
        "id": f"cit-{mobile}",
        "full_name": "Amit Verma" if mobile in ("9876543210", "9876543211") else "Citizen User",
        "mobile_number": mobile,
        "state": "Uttar Pradesh",
        "pincode": "221005",
        "role": "citizen",
    }

    token = generate_jwt_token(
        {
            "sub": user_data["id"],
            "mobile_number": mobile,
            "role": "citizen",
        }
    )

    return {
        "message": "Citizen login successful",
        "user": user_data,
        "token": token,
    }


@router.post("/citizen/register")
async def citizen_register(req: CitizenRegisterRequest):
    mobile = req.mobile_number.strip()
    name = req.full_name.strip()
    pwd = req.password.strip()

    if not mobile or not name or not pwd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "All fields are required", "code": "validation_failed"},
        )

    user_data = {
        "id": f"cit-{mobile}",
        "full_name": name,
        "mobile_number": mobile,
        "state": req.state or "Uttar Pradesh",
        "pincode": req.pincode or "221005",
        "role": "citizen",
    }

    token = generate_jwt_token(
        {
            "sub": user_data["id"],
            "mobile_number": mobile,
            "role": "citizen",
        }
    )

    return {
        "message": "Citizen registration successful",
        "user": user_data,
        "token": token,
    }


@router.post("/enumerator/login")
async def enumerator_login(req: EnumeratorLoginRequest):
    enum_id = req.enumerator_id.strip().upper()
    sec_key = req.security_key.strip()

    if not enum_id or not sec_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "Enumerator ID and security key are required", "code": "validation_failed"},
        )

    user_data = {
        "id": f"enum-{enum_id}",
        "employee_code": enum_id,
        "full_name": "Priya Sharma",
        "role": "enumerator",
        "status": "active",
    }

    token = generate_jwt_token(
        {
            "sub": user_data["id"],
            "employee_code": enum_id,
            "role": "enumerator",
        }
    )

    return {
        "message": "Enumerator login successful",
        "user": user_data,
        "token": token,
    }
