import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User 
} from 'lucide-react';

// Import images directly for better reliability
import blogImg1 from '../assets/blog1.jpg';
import blogImg2 from '../assets/blog2.jpg';
import blogImg3 from '../assets/blog3.jpg';
import blogImg4 from '../assets/blog4.jpg';
import blogImg5 from '../assets/blog5.jpg';
import blogImg6 from '../assets/blog6.jpg';

// Blog data with SEO-optimized content using imported images
const blogPosts = [
  {
    id: 1,
    slug: "science-weight-loss-metabolism",
    title: "The Science of Weight Loss: Understanding Your Body's Metabolism",
    excerpt: "Discover how your metabolism works and learn evidence-based strategies to optimize it for sustainable weight loss.",
    author: "Gooofit Research Team",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Science & Research",
    image: blogImg1,
    tags: ["metabolism", "weight loss", "BMR", "exercise", "nutrition"],
    seoDescription: "Learn the science behind metabolism and weight loss. Discover how to optimize your body's energy systems for sustainable weight management results.",
    cardTag: "Most Viewed"
  },
  {
    id: 2,
    slug: "nutrition-fundamentals-sustainable-weight-loss",
    title: "Nutrition Fundamentals for Sustainable Weight Loss",
    excerpt: "Master the basics of nutrition to create a sustainable eating plan that supports your weight loss goals.",
    author: "Gooofit Research Team",
    date: "2024-01-20",
    readTime: "10 min read",
    category: "Nutrition",
    image: blogImg2,
    tags: ["nutrition", "macronutrients", "weight loss", "healthy eating", "meal planning"],
    seoDescription: "Master the fundamentals of nutrition for sustainable weight loss. Learn about macronutrients, meal timing, and optimal food choices.",
    cardTag: "Popular"
  },
  {
    id: 3,
    slug: "exercise-strategies-maximum-fat-burning",
    title: "Exercise Strategies for Maximum Fat Burning",
    excerpt: "Discover the most effective exercise techniques to maximize fat burning and accelerate your weight loss journey.",
    author: "Gooofit Research Team",
    date: "2024-01-25",
    readTime: "12 min read",
    category: "Fitness & Exercise",
    image: blogImg3,
    tags: ["exercise", "workout", "HIIT", "strength training", "fat burning", "fitness"],
    seoDescription: "Discover the most effective exercise strategies for maximum fat burning. Learn about HIIT, strength training, and optimal workout planning.",
    cardTag: "Featured"
  },
  {
    id: 4,
    slug: "mindset-motivation-psychology-weight-loss",
    title: "Mindset and Motivation: The Psychology of Weight Loss",
    excerpt: "Learn how to develop the right mindset and maintain motivation throughout your weight loss journey.",
    author: "Gooofit Research Team",
    date: "2024-02-01",
    readTime: "7 min read",
    category: "Mindset & Motivation",
    image: blogImg4,
    tags: ["motivation", "mindset", "psychology", "weight loss", "goals"],
    seoDescription: "Develop the right mindset for successful weight loss. Learn psychological strategies to maintain motivation and overcome mental barriers."
  },
  {
    id: 5,
    slug: "sleep-weight-loss-hidden-connection",
    title: "Sleep and Weight Loss: The Hidden Connection",
    excerpt: "Discover how sleep quality and duration significantly impact your weight loss efforts and overall health.",
    author: "Gooofit Research Team",
    date: "2024-02-05",
    readTime: "6 min read",
    category: "Health & Wellness",
    image: blogImg5,
    tags: ["sleep", "weight loss", "hormones", "health", "wellness"],
    seoDescription: "Learn how sleep affects weight loss and discover strategies to optimize your sleep for better health and weight management.",
    cardTag: "New"
  },
  {
    id: 6,
    slug: "plateau-breaking-advanced-strategies-weight-loss",
    title: "Plateau Breaking: Advanced Strategies for Continued Weight Loss",
    excerpt: "When progress stalls, these advanced techniques can help you break through plateaus and continue your weight loss journey.",
    author: "Gooofit Research Team",
    date: "2024-02-10",
    readTime: "9 min read",
    category: "Advanced Strategies",
    image: blogImg6,
    tags: ["plateau", "weight loss", "advanced strategies", "progress", "motivation"],
    seoDescription: "Break through weight loss plateaus with advanced strategies. Learn techniques to restart progress and continue your weight loss journey."
  }
];

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Show 6 posts per page

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to get tag color based on tag type
  const getTagColor = (tag) => {
    switch (tag) {
      case 'Most Viewed':
        return 'bg-red-500';
      case 'New':
        return 'bg-green-500';
      case 'Popular':
        return 'bg-blue-500';
      case 'Featured':
        return 'bg-purple-500';
      case 'Trending':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Weight Loss Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-8"
          >
            Expert insights, proven strategies, and science-backed tips for your weight loss journey
          </motion.p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error(`Failed to load image for post: ${post.title}`);
                      // Hide the image if it fails to load
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  {/* Card Tag */}
                  {post.cardTag && (
                    <div className="absolute top-4 right-4">
                      <span className={`${getTagColor(post.cardTag)} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
                        {post.cardTag}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <span className="text-orange-600 font-medium">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* SEO Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Weight Loss Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Weight Loss Tips</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Nutrition Guide</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Exercise Plans</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Motivation Strategies</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Popular Topics</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Metabolism</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Intermittent Fasting</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Gut Health</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Stress Management</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Expert Insights</h3>
              <p className="text-gray-300 mb-4">
                Get the latest weight loss research, expert advice, and proven strategies to help you achieve your health goals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">Subscribe</a>
                <a href="#" className="text-orange-400 hover:text-orange-300 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog; 