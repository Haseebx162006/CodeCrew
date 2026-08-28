import os
import types
from datetime import datetime, timedelta, timezone
from typing import Any
import bcrypt
import jwt

# Fix passlib compatibility with bcrypt >= 4.0.0 (which removed __about__.__version__)
if not hasattr(bcrypt, "__about__"):
    about = types.ModuleType("about")
    about.__version__ = getattr(bcrypt, "__version__", "4.0.0")
    bcrypt.__about__ = about

from passlib.context import CryptContext
from passlib.handlers.argon2 import argon2

# Setup password hashing context using Argon2 as primary scheme
try:
    has_argon = argon2.has_backend()
except Exception:
    has_argon = False

schemes = ["argon2", "bcrypt"] if has_argon else ["bcrypt", "argon2"]
pwd_context = CryptContext(schemes=schemes, deprecated="auto")



# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "software-house-super-secret-jwt-key-change-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 60 * 60 * 24 * 7  # 7 days



def hash_password(password: str) -> str:
    """Hashes a plain-text password using passlib CryptContext."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored bcrypt hash."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def create_access_token(data: dict[str, Any], expires_delta: int = ACCESS_TOKEN_EXPIRE_SECONDS) -> str:
    """Encodes user claims into a signed JWT access token."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + timedelta(seconds=expires_delta)
    to_encode.update({"exp":expire.timestamp(),"iat":now.timestamp()})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt



def decode_access_token(token: str) -> dict[str, Any] | None:
    """Decodes and verifies a JWT access token."""
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except Exception:
        return None
