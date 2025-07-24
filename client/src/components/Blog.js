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
import blogImg7 from '../assets/blog7.jpg';
import blogImg8 from '../assets/blog8.jpg';
import blogImg9 from '../assets/blog9.jpg';
import blogImg10 from '../assets/blog10.jpg';
import blogImg11 from '../assets/blog11.jpg';
import blogImg12 from '../assets/blog12.jpg';
import blogImg13 from '../assets/blog13.jpg';
import blogImg14 from '../assets/blog14.jpg';
import blogImg15 from '../assets/blog15.jpg';
import blogImg16 from '../assets/blog16.jpg';
import blogImg17 from '../assets/blog17.jpg';
import blogImg18 from '../assets/blog18.jpg';
import blogImg19 from '../assets/blog19.jpg';
import blogImg20 from '../assets/blog20.jpg';
import blogImg21 from '../assets/blog21.jpg';
import blogImg22 from '../assets/blog22.jpg';

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
  },
  {
    id: 7,
    slug: "metabolism-weight-loss-science-explained",
    title: "The Science of Weight Loss: Understanding Your Body's Metabolism",
    excerpt: "Discover how your metabolism works and learn evidence-based strategies to optimize it for sustainable weight loss.",
    author: "Gooofit Research Team",
    date: "2024-02-15",
    readTime: "8 min read",
    category: "Science & Research",
    image: blogImg7,
    tags: ["metabolism", "weight loss", "BMR", "exercise", "nutrition"],
    seoDescription: "Learn the science behind metabolism and weight loss. Discover how to optimize your body's energy systems for sustainable weight management results."
  },
  {
    id: 8,
    slug: "nutrition-basics-weight-loss-guide",
    title: "Nutrition Fundamentals for Sustainable Weight Loss",
    excerpt: "Master the basics of nutrition to create a sustainable eating plan that supports your weight loss goals.",
    author: "Gooofit Research Team",
    date: "2024-02-20",
    readTime: "10 min read",
    category: "Nutrition",
    image: blogImg8,
    tags: ["nutrition", "macronutrients", "weight loss", "healthy eating", "meal planning"],
    seoDescription: "Master the fundamentals of nutrition for sustainable weight loss. Learn about macronutrients, meal timing, and optimal food choices."
  },
  {
    id: 9,
    slug: "sunlight-wellness-vitamin-d-mental-health",
    title: "Sunlight for Wellness: Vitamin D & Mental Health",
    excerpt: "Discover the crucial connection between vitamin D, sunlight exposure, and your mental health during weight loss.",
    author: "Gooofit Research Team",
    date: "2024-02-25",
    readTime: "7 min read",
    category: "Health & Wellness",
    image: blogImg9,
    tags: ["vitamin d", "sunlight", "mental health", "wellness", "weight loss"],
    seoDescription: "Learn about the connection between vitamin D, sunlight exposure, and mental health during your weight loss journey.",
    cardTag: "Trending"
  },
  {
    id: 10,
    slug: "intermittent-fasting-weight-loss-complete-guide",
    title: "Intermittent Fasting: A Complete Guide to Weight Loss Success",
    excerpt: "Master the art of intermittent fasting with proven strategies for sustainable weight loss and improved health.",
    author: "Gooofit Research Team",
    date: "2024-03-01",
    readTime: "11 min read",
    category: "Fasting & Nutrition",
    image: blogImg10,
    tags: ["intermittent fasting", "weight loss", "nutrition", "health", "metabolism"],
    seoDescription: "Master intermittent fasting for weight loss success. Learn proven strategies, methods, and tips for sustainable results.",
    cardTag: "Popular"
  },
  {
    id: 11,
    slug: "stress-management-weight-loss-connection",
    title: "Stress Management: The Missing Link in Your Weight Loss Journey",
    excerpt: "Discover how stress affects your weight loss efforts and learn effective strategies to manage it for better results.",
    author: "Gooofit Research Team",
    date: "2024-03-05",
    readTime: "9 min read",
    category: "Mental Health & Wellness",
    image: blogImg11,
    tags: ["stress management", "weight loss", "mental health", "cortisol", "wellness"],
    seoDescription: "Learn how stress affects weight loss and discover effective stress management techniques for better weight loss results."
  },
  {
    id: 12,
    slug: "gut-health-weight-loss-microbiome",
    title: "Gut Health and Weight Loss: The Microbiome Connection",
    excerpt: "Explore the fascinating connection between your gut microbiome and weight loss success.",
    author: "Gooofit Research Team",
    date: "2024-03-10",
    readTime: "10 min read",
    category: "Gut Health & Nutrition",
    image: blogImg12,
    tags: ["gut health", "microbiome", "weight loss", "probiotics", "nutrition"],
    seoDescription: "Discover the connection between gut health and weight loss. Learn how to optimize your microbiome for better weight management."
  },
  {
    id: 13,
    slug: "exercise-daily-boost-body-mind-happiness",
    title: "Exercise Daily: Boost Body & Mind for Happiness",
    excerpt: "Discover how daily exercise transforms not just your body, but your mental well-being and overall happiness.",
    author: "Gooofit Research Team",
    date: "2024-03-15",
    readTime: "8 min read",
    category: "Fitness & Wellness",
    image: blogImg13,
    tags: ["exercise", "daily fitness", "mental health", "happiness", "wellness"]
  },
  {
    id: 14,
    slug: "mindful-eating-fuel-body-lift-mood",
    title: "Mindful Eating: Fuel Your Body, Lift Your Mood",
    excerpt: "Transform your relationship with food through mindful eating practices that nourish both body and soul.",
    author: "Gooofit Research Team",
    date: "2024-03-20",
    readTime: "7 min read",
    category: "Mindful Living",
    image: blogImg14,
    tags: ["mindful eating", "nutrition", "mental health", "mood", "wellness"]
  },
  {
    id: 15,
    slug: "mental-health-matters-stress-less-live-more",
    title: "Mental Health Matters: Stress Less, Live More",
    excerpt: "Prioritize your mental health with proven strategies to reduce stress and enhance your quality of life.",
    author: "Gooofit Research Team",
    date: "2024-03-25",
    readTime: "9 min read",
    category: "Mental Health",
    image: blogImg15,
    tags: ["mental health", "stress reduction", "wellness", "life quality", "self-care"]
  },
  {
    id: 16,
    slug: "sleep-success-rest-enhance-well-being",
    title: "Sleep for Success: Rest to Enhance Well-Being",
    excerpt: "Discover how quality sleep is the foundation for weight loss success and overall health improvement.",
    author: "Gooofit Research Team",
    date: "2024-03-30",
    readTime: "8 min read",
    category: "Sleep & Wellness",
    image: blogImg16,
    tags: ["sleep", "well-being", "weight loss", "health", "recovery"]
  },
  {
    id: 17,
    slug: "sunlight-benefits-brighten-mood-build-health",
    title: "Sunlight Benefits: Brighten Mood & Build Health",
    excerpt: "Harness the power of natural sunlight to boost your mood, energy levels, and overall health.",
    author: "Gooofit Research Team",
    date: "2024-04-05",
    readTime: "7 min read",
    category: "Natural Health",
    image: blogImg17,
    tags: ["sunlight", "vitamin d", "mood", "health", "natural wellness"]
  },
  {
    id: 18,
    slug: "cut-screentime-sharpen-focus-reduce-anxiety",
    title: "Cut Screentime: Sharpen Focus, Reduce Anxiety",
    excerpt: "Learn how reducing screen time can dramatically improve your focus, reduce anxiety, and support your weight loss goals.",
    author: "Gooofit Research Team",
    date: "2024-04-10",
    readTime: "9 min read",
    category: "Digital Wellness",
    image: blogImg18,
    tags: ["screen time", "focus", "anxiety", "digital wellness", "mental health"]
  },
  {
    id: 19,
    slug: "fitness-joy-move-body-feel-alive",
    title: "Fitness for Joy: Move Your Body, Feel Alive",
    excerpt: "Discover how movement and fitness can bring joy, energy, and vitality to your life beyond just weight loss.",
    author: "Gooofit Research Team",
    date: "2024-04-15",
    readTime: "8 min read",
    category: "Fitness & Joy",
    image: blogImg19,
    tags: ["fitness", "joy", "movement", "energy", "vitality", "wellness"],
    cardTag: "Trending"
  },
  {
    id: 20,
    slug: "healthy-diet-hacks-nourish-body-spark-happiness",
    title: "Healthy Diet Hacks: Nourish Body, Spark Happiness",
    excerpt: "Learn simple and effective diet hacks that nourish your body while boosting your mood and happiness levels.",
    author: "Gooofit Research Team",
    date: "2024-04-20",
    readTime: "10 min read",
    category: "Nutrition & Happiness",
    image: blogImg20,
    tags: ["healthy diet", "nutrition hacks", "happiness", "mood", "wellness"]
  },
  {
    id: 21,
    slug: "meditate-peace-calm-mind-stronger-health",
    title: "Meditate for Peace: Calm Mind, Stronger Health",
    excerpt: "Explore the transformative power of meditation for mental peace, stress reduction, and enhanced overall health.",
    author: "Gooofit Research Team",
    date: "2024-04-25",
    readTime: "9 min read",
    category: "Meditation & Wellness",
    image: blogImg21,
    tags: ["meditation", "peace", "mental health", "stress reduction", "wellness"],
    cardTag: "New"
  },
  {
    id: 22,
    slug: "healthy-eating-happier-stronger-you",
    title: "Healthy Eating for a Happier, Stronger You",
    excerpt: "Discover how nutritious eating habits can transform your mood, energy levels, and overall strength.",
    author: "Gooofit Research Team",
    date: "2024-05-25",
    readTime: "8 min read",
    category: "Nutrition & Wellness",
    image: blogImg22,
    tags: ["healthy eating", "nutrition", "mood", "energy", "strength", "wellness"],
    cardTag: "Popular"
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