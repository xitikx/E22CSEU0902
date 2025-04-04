import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts } from '../api';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      borderRadius: '16px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      width: '90%',
      maxWidth: '900px',
      margin: '2rem auto',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '2rem',
      color: '#1e293b',
      textAlign: 'center',
      background: 'linear-gradient(90deg, #10b981, #34d399)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      position: 'relative',
      letterSpacing: '0.5px',
    },
    titleUnderline: {
      position: 'absolute',
      bottom: '-8px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '120px',
      height: '4px',
      background: 'linear-gradient(90deg, #10b981, #34d399)',
      borderRadius: '2px',
    },
    postCard: {
      padding: '1.75rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      marginBottom: '1.5rem',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        borderColor: '#10b981',
      }
    },
    newPostIndicator: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: '#10b981',
      animation: 'pulse 2s infinite',
    },
    image: {
      width: '100%',
      maxWidth: '350px',
      height: 'auto',
      borderRadius: '10px',
      border: 'none',
      alignSelf: 'center',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s ease',
    },
    contentWrapper: {
      padding: '0.5rem',
      background: 'rgba(248, 250, 252, 0.8)',
      borderRadius: '8px',
      position: 'relative',
    },
    content: {
      fontWeight: '600',
      fontSize: '1.15rem',
      color: '#1e293b',
      marginBottom: '0.5rem',
      lineHeight: '1.6',
      wordBreak: 'break-word',
    },
    userInfo: {
      color: '#64748b',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: '#f1f5f9',
      padding: '0.25rem 0.75rem',
      borderRadius: '6px',
      width: 'fit-content',
    },
    userIcon: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      background: '#10b981',
      display: 'inline-block',
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      fontSize: '1.6rem',
      color: '#10b981',
      animation: 'pulse 1.5s infinite',
      fontWeight: '500',
    }
  };

  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        const usersResponse = await getUsers();
        const users = Object.entries(usersResponse.data.users);

        let allPosts = [];
        for (const [userId] of users) {
          const postsResponse = await getUserPosts(userId);
          allPosts = allPosts.concat(postsResponse.data.posts);
        }

        setPosts(allPosts.sort((a, b) => b.id - a.id));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchInitialPosts();

    const interval = setInterval(async () => {
      try {
        const usersResponse = await getUsers();
        const users = Object.entries(usersResponse.data.users);
        let latestPosts = [];
        
        for (const [userId] of users) {
          const postsResponse = await getUserPosts(userId);
          latestPosts = latestPosts.concat(postsResponse.data.posts);
        }

        setPosts(prevPosts => {
          const updatedPosts = [...latestPosts, ...prevPosts];
          return updatedPosts.sort((a, b) => b.id - a.id);
        });
      } catch (error) {
        console.error('Error polling posts:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div style={styles.loading}>
      Loading Feed...
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
        Live Feed
        <div style={styles.titleUnderline}></div>
      </h2>
      <div>
        {posts.map((post, index) => (
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
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.querySelector('img').style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#f1f5f9';
              e.currentTarget.querySelector('img').style.transform = 'none';
            }}
          >
            {index < 5 && <div style={styles.newPostIndicator}></div>}
            <img 
              src={`https://picsum.photos/200?random=${post.id}`} 
              alt="Post" 
              style={styles.image}
            />
            <div style={styles.contentWrapper}>
              <p style={styles.content}>{post.content}</p>
              <p style={styles.userInfo}>
                <span style={styles.userIcon}></span>
                User #{post.userid}
              </p>
            </div>
          </div>
        ))}
      </div>
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
};

export default Feed;