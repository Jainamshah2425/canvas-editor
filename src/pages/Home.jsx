// Home Page Component
// This is the landing page where users can create a new canvas

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewCanvas } from '../config/supabase';
import './Home.css';

function Home() {
  // State to track loading while creating canvas
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  
  // Hook to navigate to different routes
  const navigate = useNavigate();

  /**
   * Handles creating a new canvas document and navigating to the editor
   */
  const handleCreateCanvas = async () => {
    try {
      setIsCreating(true);
      setError(null);
      
      // Create a new canvas document in Firestore
      const canvasId = await createNewCanvas();
      
      // Navigate to the canvas editor with the new canvas ID
      navigate(`/canvas/${canvasId}`);
    } catch (err) {
      console.error('Failed to create canvas:', err);
      setError(err.message || 'Failed to create canvas. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>🎨 Canvas Editor</h1>
        <p className="subtitle">Create and edit your designs with an intuitive canvas interface</p>
        
        <div className="features">
          <div className="feature">✏️ Draw shapes and text</div>
          <div className="feature">🎨 Customize colors</div>
          <div className="feature">💾 Auto-save to cloud</div>
          <div className="feature">🔗 Share with a link</div>
        </div>

        <button 
          className="create-button"
          onClick={handleCreateCanvas}
          disabled={isCreating}
        >
          {isCreating ? '⏳ Creating...' : '✨ Create New Canvas'}
        </button>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <p className="info-text">
          Your canvas will be saved automatically and you'll get a unique link to access it anytime
        </p>
      </div>
    </div>
  );
}

export default Home;
