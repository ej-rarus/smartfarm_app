import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart, faComment as farComment } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart, faComment as fasComment } from "@fortawesome/free-solid-svg-icons";

function Post({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const calculateTimePassed = (postDate) => {
    const posted = new Date(postDate);
    const now = new Date();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) return `${diffDays}일 전`;
    if (diffHours > 0) return `${diffHours}시간 전`;
    if (diffMinutes > 0) return `${diffMinutes}분 전`;
    return '방금 전';
  };

  return (
    <div className="post-container">
      {/* 헤더 영역 */}
      <div className="post-header">
        <div className="post-user-info">
          <img 
            src={post.userProfileImage} 
            alt="프로필" 
            className="profile-image"
          />
          <div className="user-details">
            <span className="username">{post.username}</span>
            <span className="username-suffix">님의 </span>
            <span className="crop-nickname">{post.cropNickname}</span>
            <span className="post-time">{calculateTimePassed(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* 이미지 영역 */}
      <div className="post-image-container">
        <img 
          src={post.imageUrl} 
          alt="게시물 이미지" 
          className="post-image"
        />
      </div>

      {/* 액션 버튼 영역 */}
      <div className="post-actions">
        <button 
          className="action-button"
          onClick={() => setIsLiked(!isLiked)}
        >
          <FontAwesomeIcon 
            icon={isLiked ? fasHeart : farHeart} 
            className={isLiked ? 'heart-filled' : 'heart-empty'}
          />
        </button>
        <button 
        className="action-button"
        onClick={() => setIsClicked(!isClicked)}
        >
          <FontAwesomeIcon icon={isClicked ? fasComment : farComment} />
        </button>
      </div>

      {/* 좋아요, 댓글 수 표시 */}
      <div className="post-stats">
        <span className="likes-count">좋아요 {post.likes}개</span>
        <span className="comments-count">댓글 {post.comments}개</span>
      </div>

      {/* 게시글 내용 */}
      <div className="post-content">
        <span className="content-username">{post.username}</span>
        <span className="content-text">{post.content}</span>
      </div>
    </div>
  );
}

export default Post;

