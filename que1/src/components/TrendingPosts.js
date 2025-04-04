import React, { useState, useEffect } from "react";
import { getUsers, getUserPosts, getPostComments } from "../api";

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      backgroundColor: "#ffffff",
      padding: "2.5rem",
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      width: "90%",
      maxWidth: "900px",
      margin: "2rem auto",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "800",
      marginBottom: "2rem",
      color: "#1e293b",
      textAlign: "center",
      background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      position: "relative",
      letterSpacing: "0.5px",
    },
    titleUnderline: {
      position: "absolute",
      bottom: "-8px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "120px",
      height: "4px",
      background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
      borderRadius: "2px",
    },
    postCard: {
      padding: "1.75rem",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      marginBottom: "1.5rem",
      border: "1px solid #f1f5f9",
      transition: "all 0.3s ease",
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem",
      position: "relative",
      overflow: "hidden",
      ':hover': {
        transform: "translateY(-5px)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        borderColor: "#8b5cf6",
      }
    },
    trendingBadge: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
      color: "#ffffff",
      padding: "0.25rem 0.75rem",
      borderRadius: "12px",
      fontSize: "0.85rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    image: {
      width: "100%",
      maxWidth: "350px",
      height: "auto",
      borderRadius: "10px",
      border: "none",
      alignSelf: "center",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      transition: "transform 0.3s ease",
    },
    contentWrapper: {
      padding: "0.5rem",
      background: "rgba(248, 250, 252, 0.8)",
      borderRadius: "8px",
      position: "relative",
    },
    content: {
      fontWeight: "600",
      fontSize: "1.15rem",
      color: "#1e293b",
      marginBottom: "0.5rem",
      lineHeight: "1.6",
      wordBreak: "break-word",
    },
    commentCount: {
      color: "#64748b",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontStyle: "normal",
      background: "#f1f5f9",
      padding: "0.25rem 0.75rem",
      borderRadius: "6px",
      width: "fit-content",
    },
    commentIcon: {
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      background: "#8b5cf6",
      display: "inline-block",
    },
    loading: {
      textAlign: "center",
      padding: "3rem",
      fontSize: "1.6rem",
      color: "#8b5cf6",
      animation: "pulse 1.5s infinite",
      fontWeight: "500",
    },
  };

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const usersResponse = await getUsers();
        const users = Object.entries(usersResponse.data.users);

        let allPosts = [];
        for (const [userId] of users) {
          const postsResponse = await getUserPosts(userId);
          allPosts = allPosts.concat(postsResponse.data.posts);
        }

        const postsWithComments = await Promise.all(
          allPosts.map(async (post) => {
            const commentsResponse = await getPostComments(post.id);
            return {
              ...post,
              commentCount: commentsResponse.data.comments.length,
            };
          })
        );

        const maxComments = Math.max(
          ...postsWithComments.map((p) => p.commentCount)
        );
        const trending = postsWithComments.filter(
          (p) => p.commentCount === maxComments
        );
        setTrendingPosts(trending);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  if (loading) return (
    <div style={styles.loading}>
      Loading Trending Posts...
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Trending Posts
        <div style={styles.titleUnderline}></div>
      </h2>
      <div>
        {trendingPosts.map((post) => (
          <div 
            key={post.id} 
            style={{
              ...styles.postCard,
              ':hover': {
                ...styles.postCard[':hover'],
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#8b5cf6';
              e.currentTarget.querySelector('img').style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#f1f5f9';
              e.currentTarget.querySelector('img').style.transform = 'none';
            }}
          >
            <div style={styles.trendingBadge}>Trending</div>
            <img
              src={`https://picsum.photos/200?random=${post.id}`}
              alt="Post"
              style={styles.image}
            />
            <div style={styles.contentWrapper}>
              <p style={styles.content}>{post.content}</p>
              <p style={styles.commentCount}>
                <span style={styles.commentIcon}></span>
                {post.commentCount} Comments
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;