import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const blogPosts = [
    {
      id: 1,
      title: "How Weight Loss Transforms Your Life: A Complete Guide",
      excerpt: "Discover how weight loss can transform your life physically, mentally, and emotionally. Learn the science behind weight loss and its profound impact on health, confidence, and overall well-being.",
      content: `
        <div class="blog-content">
          <h2>The Transformative Power of Weight Loss</h2>
          <p>Weight loss is more than just shedding pounds—it's a complete transformation that affects every aspect of your life. From improved physical health to enhanced mental well-being, the journey to a healthier weight can be life-changing.</p>
          
          <h3>Physical Health Benefits</h3>
          <ul>
            <li><strong>Reduced Risk of Chronic Diseases:</strong> Lower risk of diabetes, heart disease, and hypertension</li>
            <li><strong>Improved Joint Health:</strong> Less stress on knees, hips, and back</li>
            <li><strong>Better Sleep Quality:</strong> Reduced sleep apnea and improved rest</li>
            <li><strong>Increased Energy Levels:</strong> More stamina for daily activities</li>
          </ul>

          <h3>Mental and Emotional Benefits</h3>
          <p>Weight loss also brings significant psychological improvements:</p>
          <ul>
            <li>Enhanced self-confidence and self-esteem</li>
            <li>Reduced anxiety and depression symptoms</li>
            <li>Improved body image and self-perception</li>
            <li>Greater sense of accomplishment and control</li>
          </ul>

          <h3>Social and Lifestyle Benefits</h3>
          <ul>
            <li>Increased social confidence and participation</li>
            <li>Better relationships and social interactions</li>
            <li>More active lifestyle and hobbies</li>
            <li>Improved work performance and productivity</li>
          </ul>

          <h3>Getting Started on Your Transformation</h3>
          <p>Begin your weight loss journey with these foundational steps:</p>
          <ol>
            <li><strong>Set Realistic Goals:</strong> Aim for 1-2 pounds per week</li>
            <li><strong>Create a Support System:</strong> Involve friends, family, or join a community</li>
            <li><strong>Track Your Progress:</strong> Use apps or journals to monitor your journey</li>
            <li><strong>Focus on Sustainable Changes:</strong> Make lifestyle changes, not temporary diets</li>
          </ol>

          <h3>Conclusion</h3>
          <p>Weight loss is a journey that transforms not just your body, but your entire life. The benefits extend far beyond the scale, touching every aspect of your physical, mental, and social well-being.</p>
          
          <p>Remember: Every step forward is progress, and every healthy choice brings you closer to the life you deserve.</p>
        </div>
      `,
      author: "Dr. Emily Johnson",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Weight Loss",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Weight Loss for Better Health: The Complete Medical Guide",
      excerpt: "Discover the comprehensive health benefits of weight loss backed by medical research. Learn how losing weight improves heart health, diabetes management, joint health, and overall longevity.",
      content: `
        <div class="blog-content">
          <h2>The Medical Science Behind Weight Loss</h2>
          <p>Weight loss isn't just about appearance—it's a critical component of overall health and disease prevention. Medical research consistently shows that maintaining a healthy weight is one of the most important factors for long-term health.</p>
          
          <h3>Cardiovascular Health Benefits</h3>
          <ul>
            <li><strong>Reduced Blood Pressure:</strong> Lower systolic and diastolic pressure</li>
            <li><strong>Improved Cholesterol Levels:</strong> Better HDL/LDL ratio</li>
            <li><strong>Decreased Heart Disease Risk:</strong> Lower risk of heart attacks and strokes</li>
            <li><strong>Better Circulation:</strong> Improved blood flow throughout the body</li>
          </ul>

          <h3>Metabolic Health Improvements</h3>
          <ul>
            <li><strong>Diabetes Prevention:</strong> Reduced risk of type 2 diabetes</li>
            <li><strong>Better Insulin Sensitivity:</strong> Improved glucose metabolism</li>
            <li><strong>Reduced Inflammation:</strong> Lower levels of inflammatory markers</li>
            <li><strong>Improved Liver Function:</strong> Reduced fatty liver disease risk</li>
          </ul>

          <h3>Joint and Musculoskeletal Benefits</h3>
          <ul>
            <li>Reduced stress on weight-bearing joints</li>
            <li>Lower risk of osteoarthritis</li>
            <li>Improved mobility and flexibility</li>
            <li>Better posture and reduced back pain</li>
          </ul>

          <h3>Longevity and Quality of Life</h3>
          <p>Research shows that maintaining a healthy weight can:</p>
          <ul>
            <li>Increase life expectancy by 3-7 years</li>
            <li>Improve quality of life in older age</li>
            <li>Reduce healthcare costs and medical interventions</li>
            <li>Enhance overall vitality and energy</li>
          </ul>

          <h3>Conclusion</h3>
          <p>The medical benefits of weight loss are extensive and well-documented. By achieving and maintaining a healthy weight, you're investing in your long-term health and quality of life.</p>
        </div>
      `,
      author: "Dr. Michael Rodriguez",
      date: "2024-01-16",
      readTime: "10 min read",
      category: "Health & Wellness",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "BMI Calculator: Understanding Your Body Mass Index",
      excerpt: "Learn everything about BMI (Body Mass Index) - what it means, how to calculate it, BMI ranges for different heights and weights, and how to use it for your weight loss journey.",
      content: `
        <div class="blog-content">
          <h2>Understanding BMI: Your Health Indicator</h2>
          <p>Body Mass Index (BMI) is a simple yet powerful tool for assessing your weight status and health risks. Understanding your BMI can help guide your weight loss journey and health decisions.</p>
          
          <h3>What is BMI?</h3>
          <p>BMI is a measure that uses your height and weight to estimate body fat. It's calculated by dividing your weight in kilograms by your height in meters squared.</p>

          <h3>BMI Categories and Health Implications</h3>
          <ul>
            <li><strong>Underweight (BMI < 18.5):</strong> May indicate nutritional deficiencies</li>
            <li><strong>Normal Weight (BMI 18.5-24.9):</strong> Optimal health range</li>
            <li><strong>Overweight (BMI 25-29.9):</strong> Increased health risks</li>
            <li><strong>Obese (BMI ≥ 30):</strong> Significant health risks</li>
          </ul>

          <h3>How to Calculate Your BMI</h3>
          <p>Use this simple formula:</p>
          <ul>
            <li><strong>Metric:</strong> BMI = weight (kg) ÷ height (m)²</li>
            <li><strong>Imperial:</strong> BMI = (weight (lbs) × 703) ÷ height (inches)²</li>
          </ul>

          <h3>BMI Limitations</h3>
          <p>While useful, BMI has some limitations:</p>
          <ul>
            <li>Doesn't distinguish between muscle and fat</li>
            <li>May not be accurate for athletes or elderly</li>
            <li>Doesn't account for body composition</li>
            <li>May vary by ethnicity and age</li>
          </ul>

          <h3>Using BMI for Weight Loss Goals</h3>
          <p>Set realistic targets based on your BMI:</p>
          <ul>
            <li>If overweight: Aim for the normal range (18.5-24.9)</li>
            <li>If obese: Start with 5-10% weight loss</li>
            <li>Focus on sustainable, gradual progress</li>
            <li>Combine with other health metrics</li>
          </ul>

          <h3>Conclusion</h3>
          <p>BMI is a valuable tool for understanding your weight status, but it's just one piece of the health puzzle. Use it alongside other measures and consult with healthcare professionals for personalized guidance.</p>
        </div>
      `,
      author: "Dr. Lisa Chen",
      date: "2024-01-17",
      readTime: "12 min read",
      category: "Health Education",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Nutrition Guide for Effective Weight Loss: Complete Meal Plan",
      excerpt: "Master the fundamentals of nutrition for weight loss with our comprehensive guide. Learn about macronutrients, meal timing, portion control, and get a complete meal plan to kickstart your journey.",
      content: `
        <div class="blog-content">
          <h2>Nutrition Fundamentals for Weight Loss</h2>
          <p>Proper nutrition is the cornerstone of successful weight loss. Understanding what, when, and how much to eat can make the difference between temporary results and lasting change.</p>
          
          <h3>Macronutrients: The Building Blocks</h3>
          <ul>
            <li><strong>Protein (25-30%):</strong> Builds muscle, keeps you full, boosts metabolism</li>
            <li><strong>Carbohydrates (40-45%):</strong> Provides energy, supports brain function</li>
            <li><strong>Fats (25-30%):</strong> Essential for hormones, vitamin absorption</li>
          </ul>

          <h3>Key Nutrition Principles</h3>
          <ul>
            <li><strong>Calorie Deficit:</strong> Consume fewer calories than you burn</li>
            <li><strong>Whole Foods:</strong> Choose unprocessed, nutrient-dense options</li>
            <li><strong>Portion Control:</strong> Use measuring tools and visual guides</li>
            <li><strong>Meal Timing:</strong> Eat regularly to maintain stable blood sugar</li>
          </ul>

          <h3>Foods to Include</h3>
          <ul>
            <li>Lean proteins: chicken, fish, eggs, legumes</li>
            <li>Complex carbohydrates: whole grains, vegetables, fruits</li>
            <li>Healthy fats: nuts, avocados, olive oil</li>
            <li>Fiber-rich foods: vegetables, fruits, whole grains</li>
          </ul>

          <h3>Foods to Limit</h3>
          <ul>
            <li>Processed foods and added sugars</li>
            <li>Refined carbohydrates and white flour</li>
            <li>Excessive saturated and trans fats</li>
            <li>High-calorie beverages and alcohol</li>
          </ul>

          <h3>Sample Meal Plan</h3>
          <p><strong>Breakfast:</strong> Greek yogurt with berries and nuts</p>
          <p><strong>Lunch:</strong> Grilled chicken salad with mixed greens</p>
          <p><strong>Dinner:</strong> Salmon with quinoa and roasted vegetables</p>
          <p><strong>Snacks:</strong> Apple with almond butter, carrot sticks</p>

          <h3>Conclusion</h3>
          <p>Nutrition is the foundation of successful weight loss. Focus on whole, nutrient-dense foods, maintain a calorie deficit, and be consistent with your eating habits.</p>
        </div>
      `,
      author: "Dr. Sarah Wilson",
      date: "2024-01-18",
      readTime: "15 min read",
      category: "Nutrition",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Exercise Strategies for Weight Loss Success: Complete Workout",
      excerpt: "Discover the most effective exercise strategies for weight loss. Learn about cardio vs strength training, workout frequency, intensity, and get a complete workout plan to maximize your results.",
      content: `
        <div class="blog-content">
          <h2>Exercise: Your Weight Loss Accelerator</h2>
          <p>Exercise is essential for weight loss success, but not all workouts are created equal. Understanding the right combination of exercises can maximize your results and help you achieve your goals faster.</p>
          
          <h3>Cardiovascular Exercise</h3>
          <ul>
            <li><strong>High-Intensity Interval Training (HIIT):</strong> Burns more calories in less time</li>
            <li><strong>Steady-State Cardio:</strong> Builds endurance and burns fat</li>
            <li><strong>Low-Impact Options:</strong> Walking, swimming, cycling for beginners</li>
            <li><strong>Frequency:</strong> 3-5 sessions per week, 20-60 minutes each</li>
          </ul>

          <h3>Strength Training Benefits</h3>
          <ul>
            <li>Builds lean muscle mass</li>
            <li>Increases resting metabolic rate</li>
            <li>Improves body composition</li>
            <li>Enhances bone density and joint health</li>
          </ul>

          <h3>Sample Workout Plan</h3>
          <p><strong>Monday:</strong> HIIT Cardio (30 minutes)</p>
          <p><strong>Tuesday:</strong> Upper Body Strength</p>
          <p><strong>Wednesday:</strong> Steady-State Cardio (45 minutes)</p>
          <p><strong>Thursday:</strong> Lower Body Strength</p>
          <p><strong>Friday:</strong> Full Body Circuit</p>
          <p><strong>Weekend:</strong> Active recovery (walking, yoga)</p>

          <h3>Exercise Tips for Success</h3>
          <ul>
            <li>Start gradually and build intensity over time</li>
            <li>Find activities you enjoy to maintain consistency</li>
            <li>Combine cardio and strength training</li>
            <li>Listen to your body and rest when needed</li>
            <li>Track your progress and celebrate milestones</li>
          </ul>

          <h3>Conclusion</h3>
          <p>Exercise is a powerful tool for weight loss. Combine cardiovascular and strength training, stay consistent, and enjoy the journey to a healthier, stronger you.</p>
        </div>
      `,
      author: "Coach Mark Thompson",
      date: "2024-01-19",
      readTime: "12 min read",
      category: "Fitness",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Staying Motivated During Your Weight Loss Journey: Complete Guide",
      excerpt: "Learn proven strategies to stay motivated throughout your weight loss journey. Discover how to overcome plateaus, maintain consistency, and build lasting habits for long-term success.",
      content: `
        <div class="blog-content">
          <h2>The Psychology of Weight Loss Motivation</h2>
          <p>Weight loss is as much a mental journey as it is physical. Understanding how to maintain motivation and overcome challenges is crucial for long-term success.</p>
          
          <h3>Setting the Right Goals</h3>
          <ul>
            <li><strong>SMART Goals:</strong> Specific, Measurable, Achievable, Relevant, Time-bound</li>
            <li><strong>Process Goals:</strong> Focus on behaviors, not just outcomes</li>
            <li><strong>Short-term Milestones:</strong> Celebrate weekly and monthly achievements</li>
            <li><strong>Long-term Vision:</strong> Keep your ultimate goal in mind</li>
          </ul>

          <h3>Building Sustainable Habits</h3>
          <ul>
            <li>Start with small, manageable changes</li>
            <li>Stack new habits onto existing routines</li>
            <li>Use environmental cues to trigger behaviors</li>
            <li>Track your progress consistently</li>
            <li>Reward yourself for consistency, not just results</li>
          </ul>

          <h3>Overcoming Common Challenges</h3>
          <ul>
            <li><strong>Plateaus:</strong> Normal part of the process, stay consistent</li>
            <li><strong>Setbacks:</strong> Learn from them, don't let them derail you</li>
            <li><strong>Social Pressure:</strong> Communicate your goals to friends and family</li>
            <li><strong>Time Constraints:</strong> Plan ahead and prioritize your health</li>
          </ul>

          <h3>Mindset Strategies</h3>
          <ul>
            <li>Practice self-compassion and positive self-talk</li>
            <li>Focus on progress, not perfection</li>
            <li>Visualize your success regularly</li>
            <li>Surround yourself with supportive people</li>
            <li>Learn from setbacks and adjust your approach</li>
          </ul>

          <h3>Conclusion</h3>
          <p>Motivation is a skill that can be developed and maintained. Focus on building sustainable habits, celebrate progress, and remember that every healthy choice brings you closer to your goals.</p>
        </div>
      `,
      author: "Dr. Amanda Foster",
      date: "2024-01-20",
      readTime: "10 min read",
      category: "Psychology",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 7,
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
      date: "2024-01-21",
      readTime: "8 min read",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 8,
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
      date: "2024-01-22",
      readTime: "10 min read",
      category: "Health & Wellness",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 9,
      title: "Sunlight for Wellness: Vitamin D & Mental Health",
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
    },
    {
      id: 9,
      title: "Sunlight for Wellness: Vitamin D & Mental Health",
      excerpt: "Discover the powerful connection between sunlight, vitamin D, and mental health. Learn how natural light exposure can boost your mood, energy, and overall well-being.",
      content: `
        <div class="blog-content">
          <h2>The Sunshine Vitamin: Vitamin D and Your Health</h2>
          <p>Sunlight is nature's most powerful health booster. Beyond just providing warmth and light, exposure to natural sunlight triggers the production of vitamin D, a crucial nutrient that affects nearly every system in your body.</p>
          
          <h3>Vitamin D: The Sunshine Hormone</h3>
          <p>Vitamin D is unique among vitamins because your body can produce it when your skin is exposed to sunlight. This "sunshine vitamin" acts more like a hormone, regulating numerous bodily functions:</p>
          <ul>
            <li><strong>Bone Health:</strong> Essential for calcium absorption and bone strength</li>
            <li><strong>Immune Function:</strong> Supports your body's defense against infections</li>
            <li><strong>Mood Regulation:</strong> Influences serotonin and dopamine production</li>
            <li><strong>Muscle Function:</strong> Important for strength and coordination</li>
            <li><strong>Heart Health:</strong> Supports cardiovascular function</li>
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
          <p>Natural light exposure helps regulate your body's internal clock:</p>
          <ul>
            <li>Improves sleep quality and timing</li>
            <li>Enhances daytime alertness</li>
            <li>Regulates hormone production</li>
            <li>Supports natural energy cycles</li>
          </ul>

          <h4>3. Serotonin Production</h4>
          <p>Sunlight exposure increases serotonin levels, which:</p>
          <ul>
            <li>Boosts mood and happiness</li>
            <li>Reduces anxiety and stress</li>
            <li>Improves focus and concentration</li>
            <li>Enhances overall well-being</li>
          </ul>

          <h3>Optimizing Your Sunlight Exposure</h3>
          
          <h4>1. Timing Matters</h4>
          <ul>
            <li><strong>Morning Light:</strong> 10-30 minutes of early morning sun exposure</li>
            <li><strong>Midday Sun:</strong> 10-15 minutes for vitamin D production (avoid peak hours in summer)</li>
            <li><strong>Golden Hour:</strong> Evening light helps regulate sleep cycles</li>
          </ul>

          <h4>2. Safe Sun Exposure Guidelines</h4>
          <ul>
            <li>Expose arms, legs, and face to sunlight</li>
            <li>Start with 5-10 minutes and gradually increase</li>
            <li>Avoid sunburn - use sunscreen after initial exposure</li>
            <li>Consider your skin type and location</li>
            <li>Get vitamin D levels tested annually</li>
          </ul>

          <h4>3. Indoor Light Optimization</h4>
          <ul>
            <li>Open curtains and blinds during the day</li>
            <li>Position your workspace near windows</li>
            <li>Use full-spectrum light bulbs</li>
            <li>Take breaks outdoors when possible</li>
          </ul>

          <h3>Vitamin D Deficiency: Signs and Solutions</h3>
          
          <h4>Common Symptoms</h4>
          <ul>
            <li>Fatigue and tiredness</li>
            <li>Bone and muscle pain</li>
            <li>Mood changes and depression</li>
            <li>Frequent infections</li>
            <li>Slow wound healing</li>
          </ul>

          <h4>Risk Factors</h4>
          <ul>
            <li>Limited outdoor time</li>
            <li>Darker skin pigmentation</li>
            <li>Living in northern latitudes</li>
            <li>Older age</li>
            <li>Obesity</li>
          </ul>

          <h3>Supplementation and Diet</h3>
          <p>When sunlight exposure is limited, consider these sources:</p>
          <ul>
            <li><strong>Food Sources:</strong> Fatty fish, egg yolks, fortified dairy products</li>
            <li><strong>Supplements:</strong> Vitamin D3 (cholecalciferol) is most effective</li>
            <li><strong>Dosage:</strong> 600-800 IU daily for most adults (consult healthcare provider)</li>
          </ul>

          <h3>Creating a Sunlight Routine</h3>
          <p>Build healthy sunlight habits into your daily life:</p>
          <ol>
            <li><strong>Morning:</strong> Start your day with 10-15 minutes of outdoor time</li>
            <li><strong>Midday:</strong> Take a short walk or lunch break outside</li>
            <li><strong>Afternoon:</strong> Open windows and let natural light in</li>
            <li><strong>Evening:</strong> Enjoy sunset light to prepare for sleep</li>
          </ol>

          <h3>Conclusion</h3>
          <p>Sunlight is a powerful natural medicine that supports both physical and mental health. By optimizing your exposure to natural light, you can boost your vitamin D levels, improve your mood, and enhance your overall well-being.</p>
          
          <p>Remember: A little sunshine goes a long way. Make time for natural light exposure daily, and your body and mind will thank you.</p>
        </div>
      `,
      author: "Dr. Emily Watson",
      date: "2024-01-23",
      readTime: "12 min read",
      category: "Health & Wellness",
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