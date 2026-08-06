from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .database import SessionLocal, engine, Base
from . import models

# Ensure tables exist
Base.metadata.create_all(bind=engine)

SECRET_KEY = "a1e5d8589c07cddf0fa27b7b495c9676dd759d036d7748c969c92cf72a59ba78" # openssl rand -hex 32
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth_2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")
router = APIRouter(prefix="/api/auth", tags=["auth"])
app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class UserCreate(BaseModel):
    username: str
    password: str
    email: str | None = None
    full_name: str | None = None

class UserOut(BaseModel):
    id: int
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

    class Config:
        from_attributes = True

import bcrypt

# Password verification & hashing helpers
def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pwd_bytes = plain_password.encode('utf-8')[:72]
        return bcrypt.checkpw(pwd_bytes, hashed_password.encode('utf-8'))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')[:72]
    return bcrypt.hashpw(pwd_bytes, bcrypt.gensalt()).decode('utf-8')



def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)    

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth_2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Endpoints
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_username(db, username=user_in.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username is already registered")
    
    hashed_pw = get_password_hash(user_in.password)
    new_user = models.User(
        username=user_in.username,
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed_pw,
        disabled=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES) 
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me/", response_model=UserOut)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user

app.include_router(router)

@app.get("/")
async def health_check():
    return {"status": "Auth service running", "database": "SQLite connected"}