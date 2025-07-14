import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const API_BASE_URL = '/api';

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isPolling, setIsPolling] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setEvents(data.events || []);
        setError(null);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.error || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchEvents();
  };

  const createSampleEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/sample`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Refresh events after creating samples
        handleRefresh();
      }
    } catch (err) {
      console.error('Error creating sample events:', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Polling mechanism - every 15 seconds
  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      fetchEvents();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [fetchEvents, isPolling]);

  const getEventClassName = (action) => {
    return action.toLowerCase().replace('_', '-');
  };

  const formatRelativeTime = (timestamp) => {
    if (!lastUpdated) return '';
    
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - eventTime) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1 className="title">Git Ping</h1>
            <p className="subtitle">Real-time GitHub Action Tracker</p>
          </div>
        </header>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-indicator">
            <div className={`status-dot ${loading ? 'loading' : error ? 'error' : ''}`}></div>
            <span>
              {loading ? 'Loading...' : error ? 'Connection Error' : 'Live'}
            </span>
            {lastUpdated && !loading && !error && (
              <span style={{ marginLeft: '10px', fontSize: '0.9rem', opacity: 0.7 }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="refresh-button" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <span>🔄</span>
              Refresh
            </button>
            <button 
              className="refresh-button" 
              onClick={createSampleEvents}
              style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}
            >
              <span>📝</span>
              Sample Data
            </button>
          </div>
        </div>

        {/* Events Container */}
        <div className="events-container">
          <div className="events-header">
            <h2 className="events-title">Recent Activity</h2>
            <div className="events-count">
              {events.length} event{events.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Loading State */}
          {loading && events.length === 0 && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          )}

          {/* Error State */}
          {error && events.length === 0 && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h3 className="error-title">Connection Error</h3>
              <p className="error-message">{error}</p>
              <button className="retry-button" onClick={handleRefresh}>
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && events.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📡</div>
              <h3 className="empty-title">No Events Yet</h3>
              <p className="empty-message">
                Waiting for GitHub webhook events...<br />
                You can create sample events to test the interface.
              </p>
            </div>
          )}

          {/* Events List */}
          {events.length > 0 && (
            <div className="events-list">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className={`event-item ${getEventClassName(event.action)}`}
                >
                  <div className="event-content">
                    <div className="event-message">
                      {event.message}
                    </div>
                    <div className="event-meta">
                      <div className={`event-action ${getEventClassName(event.action)}`}>
                        {event.action}
                      </div>
                      <div className="event-time">
                        {formatRelativeTime(event.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

