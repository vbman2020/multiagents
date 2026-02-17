from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    body = Column(Text, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to author
    author = relationship("User", back_populates="articles", foreign_keys=[author_id])

    # Many-to-many relationship with Users who favorited this article
    favorited_by = relationship(
        "User",
        secondary="user_favorite_articles",
        back_populates="favorite_articles",
        lazy="dynamic"
    )
