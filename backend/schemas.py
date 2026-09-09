from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    designation: str = "General User"
    location: str = Field(min_length=2, max_length=150)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AlertCreateRequest(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    description: str = Field(min_length=2, max_length=1000)
    location: str = Field(min_length=2, max_length=100)
    severity: str = "MODERATE"