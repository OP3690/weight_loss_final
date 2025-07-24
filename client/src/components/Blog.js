import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Blog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the appropriate blog HTML file
    const blogUrls = {
      'weight-loss-transform-life': '/blog/weight-loss-transform-life.html',
      'weight-loss-health-benefits': '/blog/weight-loss-health-benefits.html',
      'bmi-calculator-guide': '/blog/bmi-calculator-guide.html',
      'weight-loss-nutrition': '/blog/weight-loss-nutrition.html',
      'weight-loss-exercise': '/blog/weight-loss-exercise.html',
      'weight-loss-motivation': '/blog/weight-loss-motivation.html'
    };

    if (blogId && blogUrls[blogId]) {
      window.location.href = blogUrls[blogId];
    } else if (!blogId) {
      // Redirect to blog index
      window.location.href = '/blog/index.html';
    } else {
      // Invalid blog ID, redirect to blog index
      window.location.href = '/blog/index.html';
    }
  }, [blogId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading blog...</p>
      </div>
    </div>
  );
};

export default Blog; 