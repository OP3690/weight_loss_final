import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  Share2, 
  Bookmark,
  TrendingUp,
  Target,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

// Blog data with SEO-optimized content
const blogPosts = [
  {
    id: 1,
    title: "The Science of Weight Loss: Understanding Your Body's Metabolism",
    excerpt: "Discover the scientific principles behind effective weight loss and how to optimize your metabolism for sustainable results.",
    content: `
      <div class="blog-content">
        <h2>The Fundamentals of Metabolism and Weight Loss</h2>
        <p>Understanding how your body processes energy is crucial for successful weight management. Your metabolism is the complex biochemical process that converts food into energy, and it plays a vital role in determining your weight loss success.</p>
        
        <h3>How Metabolism Works</h3>
        <p>Your metabolism consists of three main components:</p>
        <ul>
          <li><strong>Basal Metabolic Rate (BMR):</strong> The energy your body needs at rest to maintain basic functions</li>
          <li><strong>Thermic Effect of Food (TEF):</strong> Energy used to digest, absorb, and process nutrients</li>
          <li><strong>Physical Activity:</strong> Energy expended through movement and exercise</li>
        </ul>

        <div class="info-box">
          <h4>Key Takeaway</h4>
          <p>Your BMR accounts for 60-75% of your total daily energy expenditure, making it the most significant factor in weight management.</p>
        </div>

        <h3>Metabolic Rate by Age and Gender</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Age Group</th>
                <th>Men (BMR)</th>
                <th>Women (BMR)</th>
                <th>Daily Activity Factor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>18-30 years</td>
                <td>1,800-2,200</td>
                <td>1,600-1,900</td>
                <td>1.4-1.6</td>
              </tr>
              <tr>
                <td>31-50 years</td>
                <td>1,700-2,100</td>
                <td>1,500-1,800</td>
                <td>1.3-1.5</td>
              </tr>
              <tr>
                <td>51+ years</td>
                <td>1,600-2,000</td>
                <td>1,400-1,700</td>
                <td>1.2-1.4</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Factors That Influence Metabolism</h3>
        <div class="factors-grid">
          <div class="factor-card">
            <h4>Muscle Mass</h4>
            <p>Muscle tissue burns more calories than fat tissue, even at rest. Building lean muscle can increase your BMR by 5-10%.</p>
          </div>
          <div class="factor-card">
            <h4>Age</h4>
            <p>Metabolism naturally slows with age, typically decreasing by 1-2% per decade after age 30.</p>
          </div>
          <div class="factor-card">
            <h4>Hormones</h4>
            <p>Thyroid hormones, insulin, and cortisol significantly impact metabolic rate and fat storage.</p>
          </div>
          <div class="factor-card">
            <h4>Sleep Quality</h4>
            <p>Poor sleep can reduce metabolic rate by up to 15% and increase hunger hormones.</p>
          </div>
        </div>

        <h3>Optimizing Your Metabolism for Weight Loss</h3>
        <p>Here are evidence-based strategies to boost your metabolism:</p>
        
        <h4>1. Strength Training</h4>
        <p>Regular resistance training builds muscle mass, which increases your BMR. Aim for 2-3 sessions per week targeting all major muscle groups.</p>
        
        <h4>2. High-Intensity Interval Training (HIIT)</h4>
        <p>HIIT workouts create an "afterburn effect" where your body continues to burn calories at an elevated rate for hours after exercise.</p>
        
        <h4>3. Protein-Rich Diet</h4>
        <p>Protein has the highest thermic effect of all macronutrients, requiring 20-30% of its calories for digestion and processing.</p>
        
        <h4>4. Adequate Sleep</h4>
        <p>Sleep deprivation can reduce metabolic rate and increase appetite. Aim for 7-9 hours of quality sleep per night.</p>

        <div class="call-to-action">
          <h4>Ready to Optimize Your Weight Loss Journey?</h4>
          <p>Track your progress, analyze your data, and achieve your goals with our comprehensive weight management platform.</p>
          <a href="/" class="cta-button">Start Your Journey Today</a>
        </div>

        <h3>Related Articles</h3>
        <div class="related-posts">
          <a href="/blog/2" class="related-post">
            <h4>Nutrition Fundamentals for Sustainable Weight Loss</h4>
            <p>Learn the essential nutrition principles that support healthy weight management.</p>
          </a>
          <a href="/blog/3" class="related-post">
            <h4>Exercise Strategies for Maximum Fat Burning</h4>
            <p>Discover the most effective workout routines for accelerating your weight loss.</p>
          </a>
        </div>
      </div>
    `,
    author: "Weight Loss Research Team",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Science & Research",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["metabolism", "weight loss", "BMR", "exercise", "nutrition"],
    seoDescription: "Learn the science behind metabolism and weight loss. Discover how to optimize your body's energy systems for sustainable weight management results.",
    seoKeywords: "metabolism, weight loss, BMR, basal metabolic rate, weight management, fat burning"
  },
  {
    id: 2,
    title: "Nutrition Fundamentals for Sustainable Weight Loss",
    excerpt: "Master the essential nutrition principles that form the foundation of successful and sustainable weight management.",
    content: `
      <div class="blog-content">
        <h2>The Foundation of Healthy Weight Loss: Nutrition</h2>
        <p>Proper nutrition is the cornerstone of any successful weight loss journey. Understanding macronutrients, micronutrients, and how they work together is essential for achieving and maintaining your ideal weight.</p>
        
        <h3>Understanding Macronutrients</h3>
        <p>The three main macronutrients each play unique roles in your body:</p>
        
        <div class="macro-nutrients">
          <div class="macro-card">
            <h4>Proteins (4 calories/gram)</h4>
            <ul>
              <li>Builds and repairs muscle tissue</li>
              <li>Highest thermic effect (20-30%)</li>
              <li>Promotes satiety</li>
              <li>Essential for immune function</li>
            </ul>
          </div>
          <div class="macro-card">
            <h4>Carbohydrates (4 calories/gram)</h4>
            <ul>
              <li>Primary energy source</li>
              <li>Fuels brain and muscles</li>
              <li>Supports exercise performance</li>
              <li>Provides fiber for gut health</li>
            </ul>
          </div>
          <div class="macro-card">
            <h4>Fats (9 calories/gram)</h4>
            <ul>
              <li>Essential for hormone production</li>
              <li>Absorbs fat-soluble vitamins</li>
              <li>Provides long-lasting energy</li>
              <li>Supports brain health</li>
            </ul>
          </div>
        </div>

        <h3>Optimal Macronutrient Ratios for Weight Loss</h3>
        <div class="chart-container">
          <div class="pie-chart">
            <div class="chart-label">Recommended Distribution</div>
            <div class="chart-segments">
              <div class="segment protein" style="--percentage: 30%">
                <span>Protein 30%</span>
              </div>
              <div class="segment carbs" style="--percentage: 40%">
                <span>Carbs 40%</span>
              </div>
              <div class="segment fats" style="--percentage: 30%">
                <span>Fats 30%</span>
              </div>
            </div>
          </div>
        </div>

        <h3>Calorie Density and Weight Loss</h3>
        <p>Understanding calorie density helps you make better food choices:</p>
        
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Food Category</th>
                <th>Calories per 100g</th>
                <th>Satiety Level</th>
                <th>Weight Loss Friendly</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Vegetables</td>
                <td>20-50</td>
                <td>High</td>
                <td>✅ Excellent</td>
              </tr>
              <tr>
                <td>Lean Proteins</td>
                <td>100-150</td>
                <td>Very High</td>
                <td>✅ Excellent</td>
              </tr>
              <tr>
                <td>Whole Grains</td>
                <td>300-350</td>
                <td>High</td>
                <td>✅ Good</td>
              </tr>
              <tr>
                <td>Processed Foods</td>
                <td>400-600</td>
                <td>Low</td>
                <td>❌ Avoid</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Essential Micronutrients for Weight Loss</h3>
        <div class="vitamins-minerals">
          <div class="nutrient-group">
            <h4>Vitamins</h4>
            <ul>
              <li><strong>Vitamin D:</strong> Supports metabolism and fat burning</li>
              <li><strong>B Vitamins:</strong> Essential for energy production</li>
              <li><strong>Vitamin C:</strong> Supports fat oxidation during exercise</li>
            </ul>
          </div>
          <div class="nutrient-group">
            <h4>Minerals</h4>
            <ul>
              <li><strong>Iron:</strong> Prevents fatigue and supports metabolism</li>
              <li><strong>Zinc:</strong> Regulates appetite and metabolism</li>
              <li><strong>Magnesium:</strong> Supports muscle function and recovery</li>
            </ul>
          </div>
        </div>

        <h3>Meal Timing and Frequency</h3>
        <p>Research suggests that meal timing can impact weight loss success:</p>
        
        <div class="timeline">
          <div class="timeline-item">
            <h4>Breakfast (7-9 AM)</h4>
            <p>High-protein breakfast can reduce cravings and improve metabolism throughout the day.</p>
          </div>
          <div class="timeline-item">
            <h4>Lunch (12-2 PM)</h4>
            <p>Balanced meal with protein, complex carbs, and healthy fats to maintain energy levels.</p>
          </div>
          <div class="timeline-item">
            <h4>Dinner (6-8 PM)</h4>
            <p>Lighter meal focusing on protein and vegetables to support overnight recovery.</p>
          </div>
        </div>

        <div class="call-to-action">
          <h4>Track Your Nutrition Journey</h4>
          <p>Monitor your macronutrients, track your progress, and achieve your weight loss goals with our comprehensive platform.</p>
          <a href="/" class="cta-button">Start Tracking Today</a>
        </div>

        <h3>Related Articles</h3>
        <div class="related-posts">
          <a href="/blog/1" class="related-post">
            <h4>The Science of Weight Loss: Understanding Your Body's Metabolism</h4>
            <p>Learn how your metabolism works and how to optimize it for weight loss.</p>
          </a>
          <a href="/blog/3" class="related-post">
            <h4>Exercise Strategies for Maximum Fat Burning</h4>
            <p>Discover the most effective workout routines for accelerating your weight loss.</p>
          </a>
        </div>
      </div>
    `,
    author: "Nutrition Research Team",
    date: "2024-01-18",
    readTime: "10 min read",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["nutrition", "macronutrients", "weight loss", "healthy eating", "meal planning"],
    seoDescription: "Master the fundamentals of nutrition for sustainable weight loss. Learn about macronutrients, meal timing, and optimal food choices.",
    seoKeywords: "nutrition, weight loss, macronutrients, healthy eating, meal planning, calorie density"
  },
  {
    id: 3,
    title: "Exercise Strategies for Maximum Fat Burning",
    excerpt: "Discover the most effective workout routines and exercise strategies to accelerate your weight loss and build a stronger, healthier body.",
    content: `
      <div class="blog-content">
        <h2>Maximizing Fat Burn Through Strategic Exercise</h2>
        <p>Exercise is a powerful tool for weight loss, but not all workouts are created equal. Understanding the science behind fat burning can help you design the most effective exercise program for your goals.</p>
        
        <h3>The Science of Fat Burning</h3>
        <p>Your body uses different energy systems during exercise:</p>
        
        <div class="energy-systems">
          <div class="system-card">
            <h4>ATP-PC System (0-10 seconds)</h4>
            <p>Immediate energy for explosive movements like sprinting or heavy lifting.</p>
          </div>
          <div class="system-card">
            <h4>Glycolytic System (10 seconds - 2 minutes)</h4>
            <p>Anaerobic energy from stored carbohydrates for high-intensity activities.</p>
          </div>
          <div class="system-card">
            <h4>Oxidative System (2+ minutes)</h4>
            <p>Aerobic energy using oxygen to burn fat and carbohydrates for endurance activities.</p>
          </div>
        </div>

        <h3>Exercise Intensity and Fat Burning</h3>
        <div class="intensity-chart">
          <div class="chart-header">
            <h4>Fat Burning Zones</h4>
            <p>Percentage of maximum heart rate vs. fuel source</p>
          </div>
          <div class="zone-bars">
            <div class="zone low">
              <span class="zone-label">Zone 1 (50-60%)</span>
              <span class="zone-desc">Fat burning, recovery</span>
            </div>
            <div class="zone moderate">
              <span class="zone-label">Zone 2 (60-70%)</span>
              <span class="zone-desc">Aerobic base, fat burning</span>
            </div>
            <div class="zone high">
              <span class="zone-label">Zone 3 (70-80%)</span>
              <span class="zone-desc">Aerobic threshold</span>
            </div>
            <div class="zone very-high">
              <span class="zone-label">Zone 4 (80-90%)</span>
              <span class="zone-desc">Lactate threshold</span>
            </div>
            <div class="zone max">
              <span class="zone-label">Zone 5 (90-100%)</span>
              <span class="zone-desc">Maximum effort</span>
            </div>
          </div>
        </div>

        <h3>Most Effective Exercise Types for Weight Loss</h3>
        
        <h4>1. High-Intensity Interval Training (HIIT)</h4>
        <div class="exercise-detail">
          <div class="exercise-stats">
            <div class="stat">
              <span class="stat-number">15-30</span>
              <span class="stat-label">Minutes</span>
            </div>
            <div class="stat">
              <span class="stat-number">400-600</span>
              <span class="stat-label">Calories/Hour</span>
            </div>
            <div class="stat">
              <span class="stat-number">24-48</span>
              <span class="stat-label">Hours EPOC</span>
            </div>
          </div>
          <p>HIIT alternates between high-intensity bursts and recovery periods, creating an "afterburn effect" that continues burning calories for hours after your workout.</p>
        </div>

        <h4>2. Strength Training</h4>
        <div class="exercise-detail">
          <div class="exercise-stats">
            <div class="stat">
              <span class="stat-number">45-60</span>
              <span class="stat-label">Minutes</span>
            </div>
            <div class="stat">
              <span class="stat-number">300-500</span>
              <span class="stat-label">Calories/Hour</span>
            </div>
            <div class="stat">
              <span class="stat-number">5-10%</span>
              <span class="stat-label">BMR Increase</span>
            </div>
          </div>
          <p>Building muscle mass increases your basal metabolic rate, meaning you burn more calories even at rest.</p>
        </div>

        <h4>3. Steady-State Cardio</h4>
        <div class="exercise-detail">
          <div class="exercise-stats">
            <div class="stat">
              <span class="stat-number">30-60</span>
              <span class="stat-label">Minutes</span>
            </div>
            <div class="stat">
              <span class="stat-number">400-600</span>
              <span class="stat-label">Calories/Hour</span>
            </div>
            <div class="stat">
              <span class="stat-number">High</span>
              <span class="stat-label">Fat Oxidation</span>
            </div>
          </div>
          <p>Longer, moderate-intensity sessions are excellent for building endurance and burning fat during the workout.</p>
        </div>

        <h3>Weekly Exercise Plan for Weight Loss</h3>
        <div class="weekly-plan">
          <div class="day-plan">
            <h4>Monday</h4>
            <p>HIIT Cardio (20 min) + Core</p>
          </div>
          <div class="day-plan">
            <h4>Tuesday</h4>
            <p>Upper Body Strength</p>
          </div>
          <div class="day-plan">
            <h4>Wednesday</h4>
            <p>Steady-State Cardio (45 min)</p>
          </div>
          <div class="day-plan">
            <h4>Thursday</h4>
            <p>Lower Body Strength</p>
          </div>
          <div class="day-plan">
            <h4>Friday</h4>
            <p>HIIT Cardio (20 min) + Core</p>
          </div>
          <div class="day-plan">
            <h4>Saturday</h4>
            <p>Active Recovery (Yoga/Walking)</p>
          </div>
          <div class="day-plan">
            <h4>Sunday</h4>
            <p>Rest Day</p>
          </div>
        </div>

        <h3>Progressive Overload for Continued Results</h3>
        <p>To continue seeing results, you need to progressively challenge your body:</p>
        
        <div class="progression-methods">
          <div class="method">
            <h4>Increase Weight</h4>
            <p>Gradually increase resistance in strength training</p>
          </div>
          <div class="method">
            <h4>Increase Duration</h4>
            <p>Extend workout length for cardio sessions</p>
          </div>
          <div class="method">
            <h4>Increase Intensity</h4>
            <p>Work harder during high-intensity intervals</p>
          </div>
          <div class="method">
            <h4>Decrease Rest</h4>
            <p>Reduce recovery time between sets</p>
          </div>
        </div>

        <div class="call-to-action">
          <h4>Track Your Fitness Progress</h4>
          <p>Monitor your workouts, track your progress, and achieve your fitness goals with our comprehensive platform.</p>
          <a href="/" class="cta-button">Start Your Fitness Journey</a>
        </div>

        <h3>Related Articles</h3>
        <div class="related-posts">
          <a href="/blog/1" class="related-post">
            <h4>The Science of Weight Loss: Understanding Your Body's Metabolism</h4>
            <p>Learn how your metabolism works and how to optimize it for weight loss.</p>
          </a>
          <a href="/blog/2" class="related-post">
            <h4>Nutrition Fundamentals for Sustainable Weight Loss</h4>
            <p>Master the nutrition principles that support your exercise routine.</p>
          </a>
        </div>
      </div>
    `,
    author: "Fitness Research Team",
    date: "2024-01-20",
    readTime: "12 min read",
    category: "Fitness & Exercise",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["exercise", "workout", "HIIT", "strength training", "fat burning", "fitness"],
    seoDescription: "Discover the most effective exercise strategies for maximum fat burning. Learn about HIIT, strength training, and optimal workout planning.",
    seoKeywords: "exercise, workout, HIIT, strength training, fat burning, fitness, weight loss"
  }
];

const BlogPost = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === parseInt(blogId));
    setPost(foundPost);
    setLoading(false);

    // SEO: Update document title and meta description
    if (foundPost) {
      document.title = `${foundPost.title} - GoooFit Weight Loss Blog`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', foundPost.seoDescription);
      }
    }
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {post.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl mb-8"
            >
              {post.excerpt}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Article Meta */}
            <div className="flex items-center gap-6 text-gray-600 mb-8 pb-6 border-b">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Article Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-orange-100 hover:text-orange-800 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-8">
              {/* Share Buttons */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Share This Article</h3>
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Related Posts */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {blogPosts
                    .filter(p => p.id !== post.id)
                    .slice(0, 3)
                    .map((relatedPost) => (
                      <Link 
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.id}`}
                        className="block group"
                      >
                        <h4 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Blog Button */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Blog
        </button>
      </div>
    </div>
  );
};

export default BlogPost; 