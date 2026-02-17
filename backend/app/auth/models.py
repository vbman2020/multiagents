from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

# Association table for user follows (many-to-many self-referential)
user_follows = Table(
    'user_follows',
    Base.metadata,
    Column('follower_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('followed_id', Integer, ForeignKey('users.id'), primary_key=True)
)

# Association table for user favorite articles (many-to-many)
user_favorite_articles = Table(
    'user_favorite_articles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('article_id', Integer, ForeignKey('articles.id'), primary_key=True)
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # One-to-one relationship with Profile
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")

    # Many-to-many self-referential relationship for follows
    # Users this user is following
    following = relationship(
        "User",
        secondary=user_follows,
        primaryjoin=id == user_follows.c.follower_id,
        secondaryjoin=id == user_follows.c.followed_id,
        backref="followers",
        lazy="dynamic"
    )

    # Many-to-many relationship with Articles for favorites
    favorite_articles = relationship(
        "Article",
        secondary=user_favorite_articles,
        back_populates="favorited_by",
        lazy="dynamic"
    )

    # One-to-many relationship with articles authored by user
    articles = relationship("Article", back_populates="author", foreign_keys="Article.author_id")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(String, nullable=True)
    image = Column(String, nullable=True)

    # Relationship back to user
    user = relationship("User", back_populates="profile")
