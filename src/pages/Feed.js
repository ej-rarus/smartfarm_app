import React from 'react';
import Post from '../components/Post';

function Feed() {
  const posts = [
    {
      id: 1,
      username: "농부킴",
      cropNickname: "사과",
      userProfileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400",
      imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600",
      content: "오늘 토마토 수확했어요! 🍅 첫 수확인데 잘 자라서 기분이 너무 좋네요. 다들 맛있게 드세요~",
      likes: 42,
      comments: 13,
      createdAt: "2024-03-15T12:00:00"
    },
    {
      id: 2,
      username: "파머존",
      cropNickname: "당근",
      userProfileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
      imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600",
      content: "상추가 무럭무럭 자라고 있어요 🥬 곧 수확할 수 있을 것 같아요!",
      likes: 28,
      comments: 7,
      createdAt: "2024-03-14T15:30:00"
    },
    {
      id: 3,
      username: "식물집사",
      cropNickname: "방울토마토",
      userProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600",
      content: "방울토마토 모종 심었어요 🌱 잘 자라길 바라며!",
      likes: 35,
      comments: 9,
      createdAt: "2024-03-14T09:15:00"
    }
  ];

  return (
      <div className="feed-container">
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>

  );
}

export default Feed; 