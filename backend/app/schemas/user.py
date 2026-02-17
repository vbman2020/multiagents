from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


class ProfileResponse(BaseModel):
    bio: Optional[str] = None
    image: Optional[str] = None

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    bio: Optional[str] = None
    image: Optional[str] = None

    @field_validator('bio', mode='before')
    @classmethod
    def extract_bio(cls, v, info):
        """Extract bio from profile if available"""
        if v is not None:
            return v
        # Check if profile exists in the data
        data = info.data
        if hasattr(data, 'profile') and data.profile is not None:
            return data.profile.bio
        return None

    @field_validator('image', mode='before')
    @classmethod
    def extract_image(cls, v, info):
        """Extract image from profile if available"""
        if v is not None:
            return v
        # Check if profile exists in the data
        data = info.data
        if hasattr(data, 'profile') and data.profile is not None:
            return data.profile.image
        return None

    class Config:
        from_attributes = True

    @classmethod
    def from_user(cls, user):
        """Safe constructor that handles missing profile"""
        return cls(
            id=user.id,
            email=user.email,
            username=user.username,
            bio=user.profile.bio if user.profile and hasattr(user.profile, 'bio') else None,
            image=user.profile.image if user.profile and hasattr(user.profile, 'image') else None
        )


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
