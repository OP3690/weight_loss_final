import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const blogPosts = [
    {
      id: 1,
      title: "Cut Screentime, Boost Health: Improve Mood & Focus",
      excerpt: "Discover how reducing screen time can dramatically improve your mental health, focus, and overall well-being. Learn practical strategies to break free from digital addiction.",
      content: `
        <div class="blog-content">
          <h2>The Digital Dilemma: How Screens Affect Our Health</h2>
          <p>In today's hyperconnected world, we spend an average of 7-10 hours daily staring at screens. While technology has revolutionized our lives, excessive screen time is taking a toll on our physical and mental health.</p>
          
          <h3>Physical Health Impacts</h3>
          <ul>
            <li><strong>Eye Strain:</strong> Digital eye strain affects 50-90% of computer users</li>
            <li><strong>Poor Posture:</strong> Leads to neck and back pain</li>
            <li><strong>Sleep Disruption:</strong> Blue light suppresses melatonin production</li>
            <li><strong>Sedentary Lifestyle:</strong> Reduces physical activity levels</li>
          </ul>

          <h3>Mental Health Consequences</h3>
          <p>Excessive screen time has been linked to:</p>
          <ul>
            <li>Increased anxiety and depression</li>
            <li>Reduced attention span and focus</li>
            <li>Poor sleep quality</li>
            <li>Social isolation and loneliness</li>
          </ul>

          <h3>Practical Strategies to Reduce Screen Time</h3>
          
          <h4>1. Set Digital Boundaries</h4>
          <p>Establish specific times when you'll avoid screens:</p>
          <ul>
            <li>No screens 1 hour before bedtime</li>
            <li>Screen-free meals</li>
            <li>Weekend digital detox periods</li>
          </ul>

          <h4>2. Use Technology Mindfully</h4>
          <p>Leverage apps and settings to manage screen time:</p>
          <ul>
            <li>Enable screen time tracking on your devices</li>
            <li>Set app limits and downtime</li>
            <li>Use grayscale mode to reduce visual appeal</li>
            <li>Turn off non-essential notifications</li>
          </ul>

          <h4>3. Replace Screen Time with Healthy Alternatives</h4>
          <p>Fill your time with activities that promote well-being:</p>
          <ul>
            <li>Reading physical books</li>
            <li>Outdoor activities and exercise</li>
            <li>Creative hobbies (drawing, writing, cooking)</li>
            <li>Face-to-face social interactions</li>
            <li>Mindfulness and meditation</li>
          </ul>

          <h3>The Benefits You'll Experience</h3>
          <p>By reducing screen time, you can expect:</p>
          <ul>
            <li><strong>Better Sleep:</strong> Improved sleep quality and duration</li>
            <li><strong>Enhanced Focus:</strong> Increased attention span and productivity</li>
            <li><strong>Improved Mood:</strong> Reduced anxiety and better emotional regulation</li>
            <li><strong>Stronger Relationships:</strong> More meaningful social connections</li>
            <li><strong>Physical Health:</strong> Better posture, eye health, and activity levels</li>
          </ul>

          <h3>Getting Started: A 7-Day Challenge</h3>
          <p>Try this gradual approach to reduce screen time:</p>
          <ol>
            <li><strong>Day 1-2:</strong> Track your current screen time usage</li>
            <li><strong>Day 3-4:</strong> Reduce by 30 minutes daily</li>
            <li><strong>Day 5-6:</strong> Implement one new screen-free activity</li>
            <li><strong>Day 7:</strong> Reflect on changes and plan next steps</li>
          </ol>

          <h3>Conclusion</h3>
          <p>Reducing screen time isn't about eliminating technology from your life—it's about creating a healthier relationship with it. By setting boundaries and finding balance, you can enjoy the benefits of technology while protecting your physical and mental well-being.</p>
          
          <p>Start small, be consistent, and remember: every minute spent away from screens is an investment in your health and happiness.</p>
        </div>
      `,
      author: "Dr. Sarah Chen",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Sleep Well, Live Better: Benefits of Quality Rest",
      excerpt: "Unlock the secrets to better sleep and discover how quality rest can transform your health, mood, and daily performance. Learn evidence-based strategies for optimal sleep.",
      content: `
        <div class="blog-content">
          <h2>Why Sleep is Your Superpower</h2>
          <p>Sleep is not just a passive state of rest—it's an active process that's essential for every aspect of your health and well-being. Yet, 1 in 3 adults don't get enough sleep, putting their health at risk.</p>
          
          <h3>The Science of Sleep</h3>
          <p>During sleep, your body performs critical functions:</p>
          <ul>
            <li><strong>Memory Consolidation:</strong> Processing and storing new information</li>
            <li><strong>Hormone Regulation:</strong> Balancing hunger, stress, and growth hormones</li>
            <li><strong>Immune System Boost:</strong> Fighting infections and inflammation</li>
            <li><strong>Brain Detoxification:</strong> Clearing waste products and toxins</li>
            <li><strong>Muscle Repair:</strong> Rebuilding and strengthening tissues</li>
          </ul>

          <h3>Health Benefits of Quality Sleep</h3>
          
          <h4>1. Enhanced Cognitive Function</h4>
          <p>Quality sleep improves:</p>
          <ul>
            <li>Memory and learning ability</li>
            <li>Problem-solving skills</li>
            <li>Creativity and innovation</li>
            <li>Decision-making capabilities</li>
            <li>Reaction times and coordination</li>
          </ul>

          <h4>2. Emotional Well-being</h4>
          <p>Sleep plays a crucial role in emotional regulation:</p>
          <ul>
            <li>Reduces stress and anxiety</li>
            <li>Improves mood and emotional stability</li>
            <li>Enhances empathy and social skills</li>
            <li>Reduces risk of depression</li>
          </ul>

          <h4>3. Physical Health</h4>
          <p>Consistent quality sleep supports:</p>
          <ul>
            <li>Heart health and blood pressure regulation</li>
            <li>Weight management and metabolism</li>
            <li>Immune system function</li>
            <li>Muscle growth and recovery</li>
            <li>Inflammation reduction</li>
          </ul>

          <h3>Creating Your Optimal Sleep Environment</h3>
          
          <h4>1. Optimize Your Bedroom</h4>
          <ul>
            <li><strong>Temperature:</strong> Keep room between 65-68°F (18-20°C)</li>
            <li><strong>Light:</strong> Use blackout curtains and avoid blue light</li>
            <li><strong>Noise:</strong> Use white noise machines or earplugs</li>
            <li><strong>Comfort:</strong> Invest in quality mattress and pillows</li>
          </ul>

          <h4>2. Establish a Sleep Routine</h4>
          <p>Create a consistent bedtime ritual:</p>
          <ul>
            <li>Go to bed and wake up at the same time daily</li>
            <li>Wind down 1-2 hours before bedtime</li>
            <li>Avoid screens 1 hour before sleep</li>
            <li>Practice relaxation techniques (meditation, deep breathing)</li>
            <li>Read a book or listen to calming music</li>
          </ul>

          <h4>3. Lifestyle Factors</h4>
          <ul>
            <li><strong>Exercise:</strong> Regular physical activity improves sleep quality</li>
            <li><strong>Diet:</strong> Avoid heavy meals, caffeine, and alcohol before bed</li>
            <li><strong>Sunlight:</strong> Get natural light exposure during the day</li>
            <li><strong>Stress Management:</strong> Practice stress-reduction techniques</li>
          </ul>

          <h3>Common Sleep Problems and Solutions</h3>
          
          <h4>Insomnia</h4>
          <p>If you have trouble falling or staying asleep:</p>
          <ul>
            <li>Practice cognitive behavioral therapy for insomnia (CBT-I)</li>
            <li>Use relaxation techniques</li>
            <li>Avoid clock-watching</li>
            <li>Get out of bed if you can't sleep after 20 minutes</li>
          </ul>

          <h4>Sleep Apnea</h4>
          <p>If you snore loudly or wake up gasping:</p>
          <ul>
            <li>Consult a sleep specialist</li>
            <li>Consider CPAP therapy if prescribed</li>
            <li>Maintain a healthy weight</li>
            <li>Sleep on your side instead of back</li>
          </ul>

          <h3>Sleep Tracking and Optimization</h3>
          <p>Monitor your sleep patterns to identify areas for improvement:</p>
          <ul>
            <li>Use sleep tracking apps or devices</li>
            <li>Keep a sleep diary</li>
            <li>Note factors that affect your sleep quality</li>
            <li>Adjust your routine based on data</li>
          </ul>

          <h3>Conclusion</h3>
          <p>Quality sleep is the foundation of good health and well-being. By prioritizing sleep and creating optimal conditions for rest, you can unlock your full potential and enjoy better physical, mental, and emotional health.</p>
          
          <p>Remember: Sleep is not a luxury—it's a necessity. Make it a priority, and your body and mind will thank you.</p>
        </div>
      `,
      author: "Dr. Michael Rodriguez",
      date: "2024-01-20",
      readTime: "10 min read",
      category: "Health & Wellness",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Sunlight for Wellness: Vitamin D & Mental Health",
      excerpt: "Explore the powerful connection between sunlight exposure, vitamin D production, and mental health. Learn how to safely harness the sun's benefits for optimal well-being.",
      content: `
        <div class="blog-content">
          <h2>The Sunshine Vitamin: Your Natural Mood Booster</h2>
          <p>Sunlight is more than just a source of light—it's a powerful natural medicine that affects every cell in your body. From vitamin D production to circadian rhythm regulation, the sun plays a crucial role in your health and happiness.</p>
          
          <h3>Vitamin D: The Sunshine Hormone</h3>
          <p>When your skin is exposed to UVB rays from sunlight, it produces vitamin D, often called the "sunshine vitamin." This essential nutrient acts more like a hormone than a vitamin, regulating hundreds of genes throughout your body.</p>

          <h4>Vitamin D's Role in Health</h4>
          <ul>
            <li><strong>Bone Health:</strong> Essential for calcium absorption and bone strength</li>
            <li><strong>Immune Function:</strong> Supports immune system regulation</li>
            <li><strong>Mental Health:</strong> Influences mood and cognitive function</li>
            <li><strong>Heart Health:</strong> Supports cardiovascular function</li>
            <li><strong>Cancer Prevention:</strong> May reduce risk of certain cancers</li>
          </ul>

          <h3>Sunlight and Mental Health</h3>
          
          <h4>1. Seasonal Affective Disorder (SAD)</h4>
          <p>Reduced sunlight exposure during winter months can trigger SAD, characterized by:</p>
          <ul>
            <li>Depression and low mood</li>
            <li>Increased sleep and fatigue</li>
            <li>Weight gain and carbohydrate cravings</li>
            <li>Social withdrawal</li>
            <li>Difficulty concentrating</li>
          </ul>

          <h4>2. Circadian Rhythm Regulation</h4>
          <p>Sunlight exposure helps regulate your body's internal clock:</p>
          <ul>
            <li>Improves sleep quality and timing</li>
            <li>Enhances energy levels during the day</li>
            <li>Regulates hormone production</li>
            <li>Supports healthy metabolism</li>
          </ul>

          <h4>3. Serotonin Production</h4>
          <p>Sunlight exposure increases serotonin production, which:</p>
          <ul>
            <li>Improves mood and reduces depression</li>
            <li>Enhances focus and cognitive function</li>
            <li>Reduces anxiety and stress</li>
            <li>Promotes feelings of well-being</li>
          </ul>

          <h3>Safe Sun Exposure Guidelines</h3>
          
          <h4>Optimal Exposure Times</h4>
          <ul>
            <li><strong>Spring/Summer:</strong> 10-15 minutes of midday sun exposure</li>
            <li><strong>Fall/Winter:</strong> 20-30 minutes of midday exposure</li>
            <li><strong>Skin Type:</strong> Fair skin needs less time than darker skin</li>
            <li><strong>Location:</strong> Higher altitudes require less exposure time</li>
          </ul>

          <h4>Safety Precautions</h4>
          <ul>
            <li>Avoid peak UV hours (10 AM - 4 PM) for extended exposure</li>
            <li>Use sunscreen after initial vitamin D production period</li>
            <li>Wear protective clothing and sunglasses</li>
            <li>Stay hydrated during sun exposure</li>
            <li>Monitor for signs of sunburn</li>
          </ul>

          <h3>Maximizing Sunlight Benefits</h3>
          
          <h4>1. Morning Sunlight</h4>
          <p>Early morning sun exposure (within 1 hour of waking) is particularly beneficial:</p>
          <ul>
            <li>Sets your circadian rhythm for the day</li>
            <li>Improves alertness and energy levels</li>
            <li>Enhances mood and reduces stress</li>
            <li>Supports healthy sleep patterns</li>
          </ul>

          <h4>2. Outdoor Activities</h4>
          <p>Combine sunlight exposure with physical activity:</p>
          <ul>
            <li>Morning walks or runs</li>
            <li>Outdoor exercise classes</li>
            <li>Gardening or yard work</li>
            <li>Outdoor sports and recreation</li>
            <li>Picnics and outdoor dining</li>
          </ul>

          <h4>3. Indoor Light Therapy</h4>
          <p>For areas with limited sunlight, consider light therapy:</p>
          <ul>
            <li>Use full-spectrum light bulbs</li>
            <li>Invest in a light therapy box</li>
            <li>Position work areas near windows</li>
            <li>Take regular breaks outdoors</li>
          </ul>

          <h3>Vitamin D Supplementation</h3>
          <p>When natural sunlight isn't sufficient, supplementation may be necessary:</p>
          <ul>
            <li><strong>Testing:</strong> Get vitamin D levels checked annually</li>
            <li><strong>Dosage:</strong> Consult healthcare provider for appropriate dose</li>
            <li><strong>Timing:</strong> Take with meals containing fat for better absorption</li>
            <li><strong>Monitoring:</strong> Retest levels after 3-6 months</li>
          </ul>

          <h3>Seasonal Strategies</h3>
          
          <h4>Summer</h4>
          <ul>
            <li>Enjoy early morning and late afternoon sun</li>
            <li>Stay hydrated and use sun protection</li>
            <li>Engage in outdoor activities</li>
            <li>Store vitamin D for winter months</li>
          </ul>

          <h4>Winter</h4>
          <ul>
            <li>Maximize midday sun exposure</li>
            <li>Consider vitamin D supplementation</li>
            <li>Use light therapy if needed</li>
            <li>Maintain outdoor activity levels</li>
          </ul>

          <h3>Conclusion</h3>
          <p>Sunlight is a powerful natural medicine that supports both physical and mental health. By understanding how to safely harness its benefits, you can improve your mood, energy levels, and overall well-being.</p>
          
          <p>Remember: Balance is key. Enjoy the sun's benefits while protecting your skin and health. A little daily sunlight can go a long way toward improving your quality of life.</p>
        </div>
      `,
      author: "Dr. Emily Watson",
      date: "2024-01-25",
      readTime: "9 min read",
      category: "Natural Health",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const [selectedPost, setSelectedPost] = useState(null);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const openPost = (post) => {
    setSelectedPost(post);
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Health & Wellness Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover evidence-based insights on mental health, sleep, nutrition, and lifestyle optimization
            </p>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => openPost(post)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <User className="w-4 h-4 mr-1" />
                  <span className="mr-4">{post.author}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Read More →
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Blog Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={closePost}
                className="absolute top-4 right-4 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <User className="w-4 h-4 mr-1" />
                <span className="mr-4">{selectedPost.author}</span>
                <Clock className="w-4 h-4 mr-1" />
                <span className="mr-4">{selectedPost.readTime}</span>
                <span>{selectedPost.date}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {selectedPost.title}
              </h1>
              
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog; 