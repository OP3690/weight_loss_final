import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Blog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Map blog IDs to their HTML file paths
    const blogUrls = {
      'weight-loss-transform-life': '/blog/weight-loss-transform-life.html',
      'weight-loss-health-benefits': '/blog/weight-loss-health-benefits.html',
      'bmi-calculator-guide': '/blog/bmi-calculator-guide.html',
      'weight-loss-nutrition': '/blog/weight-loss-nutrition.html',
      'weight-loss-exercise': '/blog/weight-loss-exercise.html',
      'weight-loss-motivation': '/blog/weight-loss-motivation.html'
    };

    if (blogId && blogUrls[blogId]) {
      // Open the blog post in a new tab
      window.open(blogUrls[blogId], '_blank');
      // Navigate back to dashboard after opening
      navigate('/');
    } else if (!blogId) {
      // Open blog index in a new tab
      window.open('/blog/index.html', '_blank');
      // Navigate back to dashboard after opening
      navigate('/');
    } else {
      // Invalid blog ID, open blog index
      window.open('/blog/index.html', '_blank');
      navigate('/');
    }
  }, [blogId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Opening blog in new tab...</p>
        <p className="text-sm text-gray-500 mt-2">You'll be redirected back to the dashboard</p>
      </div>
    </div>
  );
};

export default Blog; 