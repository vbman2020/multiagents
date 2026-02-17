from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.dependencies import get_current_user, get_optional_current_user
from app.auth.models import User
from app.articles.models import Article

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("/")
def list_articles(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
    limit: int = 20,
    offset: int = 0
):
    """
    List articles with optional authentication
    
    Uses get_optional_current_user to allow both authenticated and anonymous access.
    When authenticated, can show additional data like whether user favorited the article.
    """
    articles = db.query(Article).offset(offset).limit(limit).all()
    
    result = []
    for article in articles:
        article_data = {
            "id": article.id,
            "title": article.title,
            "description": article.description,
            "body": article.body,
            "slug": article.slug,
            "author_id": article.author_id,
            "created_at": article.created_at,
            "updated_at": article.updated_at,
        }
        
        # If user is authenticated, add favorite status
        if current_user:
            article_data["favorited"] = article in current_user.favorite_articles.all()
            article_data["favorites_count"] = article.favorited_by.count()
        else:
            article_data["favorited"] = False
            article_data["favorites_count"] = article.favorited_by.count()
        
        result.append(article_data)
    
    return {"articles": result, "articles_count": len(result)}


@router.get("/{slug}")
def get_article(
    slug: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Get a single article by slug
    
    Uses get_optional_current_user for optional authentication.
    """
    article = db.query(Article).filter(Article.slug == slug).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    article_data = {
        "id": article.id,
        "title": article.title,
        "description": article.description,
        "body": article.body,
        "slug": article.slug,
        "author_id": article.author_id,
        "created_at": article.created_at,
        "updated_at": article.updated_at,
    }
    
    # If user is authenticated, add favorite status
    if current_user:
        article_data["favorited"] = article in current_user.favorite_articles.all()
    else:
        article_data["favorited"] = False
    
    article_data["favorites_count"] = article.favorited_by.count()
    
    return {"article": article_data}


@router.post("/{slug}/favorite")
def favorite_article(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Favorite an article (requires authentication)
    
    Uses get_current_user to require authentication.
    """
    article = db.query(Article).filter(Article.slug == slug).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Check if already favorited
    if article in current_user.favorite_articles.all():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Article already favorited"
        )
    
    # Add to favorites using the many-to-many relationship
    current_user.favorite_articles.append(article)
    db.commit()
    
    return {"message": "Article favorited successfully"}


@router.delete("/{slug}/favorite")
def unfavorite_article(
    slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Unfavorite an article (requires authentication)
    
    Uses get_current_user to require authentication.
    """
    article = db.query(Article).filter(Article.slug == slug).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Check if not favorited
    if article not in current_user.favorite_articles.all():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Article not favorited"
        )
    
    # Remove from favorites using the many-to-many relationship
    current_user.favorite_articles.remove(article)
    db.commit()
    
    return {"message": "Article unfavorited successfully"}


@router.post("/{username}/follow")
def follow_user(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Follow another user (requires authentication)
    
    Demonstrates the many-to-many follow relationship.
    """
    user_to_follow = db.query(User).filter(User.username == username).first()
    
    if not user_to_follow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user_to_follow.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot follow yourself"
        )
    
    # Check if already following
    if user_to_follow in current_user.following.all():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already following this user"
        )
    
    # Add to following using the many-to-many relationship
    current_user.following.append(user_to_follow)
    db.commit()
    
    return {"message": f"Now following {username}"}


@router.delete("/{username}/follow")
def unfollow_user(
    username: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Unfollow a user (requires authentication)
    
    Demonstrates the many-to-many follow relationship.
    """
    user_to_unfollow = db.query(User).filter(User.username == username).first()
    
    if not user_to_unfollow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if not following
    if user_to_unfollow not in current_user.following.all():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not following this user"
        )
    
    # Remove from following using the many-to-many relationship
    current_user.following.remove(user_to_unfollow)
    db.commit()
    
    return {"message": f"Unfollowed {username}"}


@router.get("/user/{username}/followers")
def get_followers(
    username: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Get list of followers for a user
    
    Demonstrates bidirectional querying of the follow relationship.
    """
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Query followers using the bidirectional relationship
    followers = user.followers.all()
    
    return {
        "followers": [
            {
                "id": follower.id,
                "username": follower.username,
                "email": follower.email
            }
            for follower in followers
        ],
        "followers_count": len(followers)
    }


@router.get("/user/{username}/following")
def get_following(
    username: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Get list of users that this user is following
    
    Demonstrates bidirectional querying of the follow relationship.
    """
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Query following using the relationship
    following = user.following.all()
    
    return {
        "following": [
            {
                "id": followed.id,
                "username": followed.username,
                "email": followed.email
            }
            for followed in following
        ],
        "following_count": len(following)
    }
