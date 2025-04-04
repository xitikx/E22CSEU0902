import React, { useState, useEffect } from 'react';
import { getUsers, getUserPosts } from '../api';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      borderRadius: '16px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
      width: '90%',
      maxWidth: '700px',
      margin: '2rem auto',
      position: 'relative',
      overflow: 'hidden',
    },
    title: {
      fontSize: '2.25rem',
      fontWeight: '800',
      marginBottom: '2rem',
      color: '#1a1a1a',
      textAlign: 'center',
      background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      position: 'relative',
      paddingBottom: '0.5rem',
    },
    titleUnderline: {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100px',
      height: '3px',
      background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
      borderRadius: '2px',
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '1.25rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      marginBottom: '1.25rem',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      ':hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        borderColor: '#4f46e5',
      }
    },
    rankBadge: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: '1rem',
      flexShrink: 0,
    },
    image: {
      borderRadius: '50%',
      width: '64px',
      height: '64px',
      border: '3px solid transparent',
      background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #4f46e5, #06b6d4) border-box',
      flexShrink: 0,
      transition: 'transform 0.3s ease',
    },
    userInfo: {
      flex: 1,
      position: 'relative',
    },
    userName: {
      fontWeight: '700',
      fontSize: '1.25rem',
      color: '#1e293b',
      marginBottom: '0.25rem',
      transition: 'color 0.3s ease',
    },
    postCount: {
      color: '#64748b',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    postIcon: {
      width: '16px',
      height: '16px',
      borderRadius: '4px',
      background: '#e2e8f0',
      display: 'inline-block',
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      fontSize: '1.5rem',
      color: '#4f46e5',
      animation: 'pulse 1.5s infinite',
    }
  };

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const usersResponse = await getUsers();
        const users = Object.entries(usersResponse.data.users).map(([id, name]) => ({
          id,
          name,
          postCount: 0
        }));

        const userPostPromises = users.map(async (user) => {
          const postsResponse = await getUserPosts(user.id);
          return { ...user, postCount: postsResponse.data.posts.length };
        });

        const usersWithPosts = await Promise.all(userPostPromises);
        const sortedUsers = usersWithPosts.sort((a, b) => b.postCount - a.postCount);
        setTopUsers(sortedUsers.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top users:', error);
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  if (loading) return (
    <div style={styles.loading}>
      Loading Top Users...
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
        Top 5 Users by Post Count
        <div style={styles.titleUnderline}></div>
      </h2>
      <div>
        {topUsers.map((user, index) => (
          <div 
            key={user.id} 
            style={{
              ...styles.userCard,
              ':hover': {
                ...styles.userCard[':hover'],
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#f1f5f9';
            }}
          >
            <div style={styles.rankBadge}>{index + 1}</div>
            <img 
              src={`https://picsum.photos/50?random=${user.id}`} 
              alt={user.name} 
              style={styles.image}
            />
            <div style={styles.userInfo}>
              <h3 style={styles.userName}>{user.name}</h3>
              <p style={styles.postCount}>
                <span style={styles.postIcon}></span>
                {user.postCount} Posts
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsers;