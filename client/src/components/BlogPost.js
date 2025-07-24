import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Blog data with SEO-optimized content using local BlogImg images
const blogPosts = [
  {
    id: 1,
    slug: "science-weight-loss-metabolism",
    title: "The Science of Weight Loss: Understanding Your Body's Metabolism",
    excerpt: "Discover how your metabolism works and learn evidence-based strategies to optimize it for sustainable weight loss.",
    content: `
      <div class="article-content">
        <h2>Understanding Your Metabolism</h2>
        <p>Your metabolism is the complex process by which your body converts food into energy. Understanding how it works is crucial for effective weight loss.</p>
        
        <div class="info-box">
          <h3>Key Metabolic Factors</h3>
          <ul>
            <li><strong>Basal Metabolic Rate (BMR):</strong> The calories your body burns at rest</li>
            <li><strong>Thermic Effect of Food:</strong> Energy used to digest and process food</li>
            <li><strong>Physical Activity:</strong> Calories burned through movement and exercise</li>
            <li><strong>Non-Exercise Activity Thermogenesis (NEAT):</strong> Daily activities like walking, fidgeting</li>
          </ul>
        </div>

        <h2>How to Boost Your Metabolism</h2>
        <p>Several factors influence your metabolic rate, and understanding these can help you optimize your weight loss journey.</p>
        
        <div class="data-table">
          <h3>Metabolism-Boosting Strategies</h3>
          <table>
            <thead>
              <tr>
                <th>Strategy</th>
                <th>Impact</th>
                <th>Implementation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Strength Training</td>
                <td>Increases muscle mass and BMR</td>
                <td>2-3 sessions per week</td>
              </tr>
              <tr>
                <td>High-Intensity Exercise</td>
                <td>Elevates metabolism for hours</td>
                <td>20-30 minutes, 3x weekly</td>
              </tr>
              <tr>
                <td>Protein-Rich Diet</td>
                <td>Higher thermic effect</td>
                <td>0.8-1.2g per kg body weight</td>
              </tr>
              <tr>
                <td>Adequate Sleep</td>
                <td>Maintains hormonal balance</td>
                <td>7-9 hours per night</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Common Metabolism Myths</h2>
        <p>There are many misconceptions about metabolism that can hinder your weight loss progress.</p>
        
        <div class="myth-fact">
          <div class="myth">
            <h4>❌ Myth: Eating late causes weight gain</h4>
            <p>It's not when you eat, but how much you eat that matters for weight loss.</p>
          </div>
          <div class="fact">
            <h4>✅ Fact: Total daily calories matter most</h4>
            <p>Focus on your overall daily caloric intake rather than meal timing.</p>
          </div>
        </div>

        <h2>Practical Tips for Metabolic Health</h2>
        <ul>
          <li>Stay hydrated - water is essential for metabolic processes</li>
          <li>Eat regular meals to maintain stable blood sugar</li>
          <li>Include fiber-rich foods to support gut health</li>
          <li>Manage stress levels to prevent cortisol-related weight gain</li>
          <li>Get regular physical activity throughout the day</li>
        </ul>
      </div>
    `,
    author: "Weight Loss Experts",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Science & Research",
    image: "/BlogImg/bruce-mars-gJtDg6WfMlQ-unsplash.jpg",
    tags: ["metabolism", "weight loss", "BMR", "exercise", "nutrition"],
    seoDescription: "Learn the science behind metabolism and weight loss. Discover how to optimize your body's energy systems for sustainable weight management results."
  },
  {
    id: 2,
    slug: "nutrition-fundamentals-sustainable-weight-loss",
    title: "Nutrition Fundamentals for Sustainable Weight Loss",
    excerpt: "Master the basics of nutrition to create a sustainable eating plan that supports your weight loss goals.",
    content: `
      <div class="article-content">
        <h2>The Foundation of Good Nutrition</h2>
        <p>Understanding nutrition fundamentals is essential for creating a sustainable weight loss plan that works for your lifestyle.</p>
        
        <div class="info-box">
          <h3>Macronutrients Explained</h3>
          <ul>
            <li><strong>Proteins:</strong> Building blocks for muscle, 4 calories per gram</li>
            <li><strong>Carbohydrates:</strong> Primary energy source, 4 calories per gram</li>
            <li><strong>Fats:</strong> Essential for hormone production, 9 calories per gram</li>
          </ul>
        </div>

        <h2>Optimal Macronutrient Ratios for Weight Loss</h2>
        <p>Finding the right balance of macronutrients can significantly impact your weight loss success.</p>
        
        <div class="macronutrient-ratios">
          <h3>Recommended Ratios</h3>
          <ul>
            <li><strong>Protein:</strong> 25-30% of daily calories</li>
            <li><strong>Carbohydrates:</strong> 40-45% of daily calories</li>
            <li><strong>Fats:</strong> 25-30% of daily calories</li>
          </ul>
        </div>

        <h2>Meal Planning Strategies</h2>
        <p>Effective meal planning is key to maintaining a healthy diet and achieving your weight loss goals.</p>
        
        <div class="meal-planning-tips">
          <h3>Weekly Meal Planning Steps</h3>
          <ol>
            <li>Plan your meals for the entire week</li>
            <li>Create a shopping list based on your plan</li>
            <li>Prep ingredients in advance</li>
            <li>Cook in batches to save time</li>
            <li>Store meals in portion-controlled containers</li>
          </ol>
        </div>

        <h2>Mindful Eating Practices</h2>
        <p>Developing mindful eating habits can help you better understand your hunger cues and prevent overeating.</p>
        
        <div class="mindful-eating">
          <h3>Mindful Eating Techniques</h3>
          <ul>
            <li>Eat slowly and savor each bite</li>
            <li>Pay attention to hunger and fullness cues</li>
            <li>Eliminate distractions during meals</li>
            <li>Practice gratitude for your food</li>
            <li>Listen to your body's signals</li>
          </ul>
        </div>
      </div>
    `,
    author: "Nutrition Specialists",
    date: "2024-01-20",
    readTime: "10 min read",
    category: "Nutrition",
    image: "/BlogImg/lyfefuel-4wtxPhvQZds-unsplash.jpg",
    tags: ["nutrition", "macronutrients", "weight loss", "healthy eating", "meal planning"],
    seoDescription: "Master the fundamentals of nutrition for sustainable weight loss. Learn about macronutrients, meal timing, and optimal food choices."
  },
  {
    id: 3,
    slug: "exercise-strategies-maximum-fat-burning",
    title: "Exercise Strategies for Maximum Fat Burning",
    excerpt: "Discover the most effective exercise techniques to maximize fat burning and accelerate your weight loss journey.",
    content: `
      <div class="article-content">
        <h2>Understanding Fat Burning</h2>
        <p>To maximize fat burning, it's important to understand how your body uses different energy systems during exercise.</p>
        
        <div class="info-box">
          <h3>Energy Systems</h3>
          <ul>
            <li><strong>Phosphagen System:</strong> Short bursts of high-intensity activity</li>
            <li><strong>Glycolytic System:</strong> Medium-duration, moderate to high intensity</li>
            <li><strong>Oxidative System:</strong> Long-duration, low to moderate intensity</li>
          </ul>
        </div>

        <h2>High-Intensity Interval Training (HIIT)</h2>
        <p>HIIT is one of the most effective methods for burning fat and improving cardiovascular fitness.</p>
        
        <div class="exercise-detail">
          <h3>HIIT Benefits</h3>
          <p>HIIT workouts typically last 20-30 minutes and can burn more calories than longer steady-state cardio sessions. The high-intensity intervals create an "afterburn effect" that continues to burn calories for hours after your workout.</p>
        </div>

        <h2>Strength Training for Fat Loss</h2>
        <p>Building muscle through strength training is crucial for long-term fat loss and metabolic health.</p>
        
        <div class="exercise-detail">
          <h3>Strength Training Benefits</h3>
          <p>Muscle tissue is metabolically active, meaning it burns calories even at rest. Regular strength training increases your basal metabolic rate and helps maintain muscle mass during weight loss.</p>
        </div>

        <h2>Steady-State Cardio</h2>
        <p>While HIIT is excellent for fat burning, steady-state cardio also plays an important role in your fitness routine.</p>
        
        <div class="exercise-detail">
          <h3>Steady-State Benefits</h3>
          <p>Longer, moderate-intensity sessions are excellent for building endurance and burning fat during the workout. They're also easier to maintain for longer periods, making them ideal for beginners.</p>
        </div>

        <h2>Weekly Exercise Plan for Weight Loss</h2>
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

        <h2>Progressive Overload for Continued Results</h2>
        <p>To continue seeing results, you need to progressively challenge your body.</p>
        
        <div class="progressive-overload">
          <div class="overload-card">
            <h4>Increase Weight</h4>
            <p>Gradually increase resistance in strength training</p>
          </div>
          <div class="overload-card">
            <h4>Increase Duration</h4>
            <p>Extend workout length for cardio sessions</p>
          </div>
          <div class="overload-card">
            <h4>Increase Intensity</h4>
            <p>Work harder during high-intensity intervals</p>
          </div>
          <div class="overload-card">
            <h4>Decrease Rest</h4>
            <p>Reduce recovery time between sets</p>
          </div>
        </div>
      </div>
    `,
    author: "Fitness Professionals",
    date: "2024-01-25",
    readTime: "12 min read",
    category: "Fitness & Exercise",
    image: "/BlogImg/bruce-mars-tj27cwu86Wk-unsplash.jpg",
    tags: ["exercise", "workout", "HIIT", "strength training", "fat burning", "fitness"],
    seoDescription: "Discover the most effective exercise strategies for maximum fat burning. Learn about HIIT, strength training, and optimal workout planning."
  },
  {
    id: 4,
    slug: "mindset-motivation-psychology-weight-loss",
    title: "Mindset and Motivation: The Psychology of Weight Loss",
    excerpt: "Learn how to develop the right mindset and maintain motivation throughout your weight loss journey.",
    content: `
      <div class="article-content">
        <h2>The Psychology of Weight Loss</h2>
        <p>Weight loss is as much about mindset as it is about diet and exercise. Understanding the psychological aspects can make all the difference.</p>
        
        <div class="info-box">
          <h3>Key Psychological Factors</h3>
          <ul>
            <li><strong>Self-Efficacy:</strong> Belief in your ability to succeed</li>
            <li><strong>Intrinsic Motivation:</strong> Internal drive to achieve goals</li>
            <li><strong>Goal Setting:</strong> Clear, achievable objectives</li>
            <li><strong>Stress Management:</strong> Coping with emotional eating</li>
          </ul>
        </div>

        <h2>Building Sustainable Motivation</h2>
        <p>Motivation fluctuates, but you can develop strategies to maintain it consistently.</p>
        
        <div class="motivation-strategies">
          <h3>Motivation Maintenance Techniques</h3>
          <ul>
            <li>Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)</li>
            <li>Track your progress regularly</li>
            <li>Celebrate small victories</li>
            <li>Find an accountability partner</li>
            <li>Visualize your success</li>
          </ul>
        </div>

        <h2>Overcoming Common Mental Barriers</h2>
        <p>Identifying and addressing mental barriers is crucial for long-term success.</p>
        
        <div class="mental-barriers">
          <div class="barrier">
            <h4>All-or-Nothing Thinking</h4>
            <p>Challenge the belief that one mistake ruins everything. Progress is cumulative.</p>
          </div>
          <div class="barrier">
            <h4>Comparison Trap</h4>
            <p>Focus on your own journey rather than comparing yourself to others.</p>
          </div>
          <div class="barrier">
            <h4>Impatience</h4>
            <p>Remember that sustainable weight loss takes time. Trust the process.</p>
          </div>
        </div>
      </div>
    `,
    author: "Psychology Experts",
    date: "2024-02-01",
    readTime: "7 min read",
    category: "Mindset & Motivation",
    image: "/BlogImg/lyfefuel-4wtxPhvQZds-unsplash.jpg",
    tags: ["motivation", "mindset", "psychology", "weight loss", "goals"],
    seoDescription: "Develop the right mindset for successful weight loss. Learn psychological strategies to maintain motivation and overcome mental barriers."
  },
  {
    id: 5,
    slug: "sleep-weight-loss-hidden-connection",
    title: "Sleep and Weight Loss: The Hidden Connection",
    excerpt: "Discover how sleep quality and duration significantly impact your weight loss efforts and overall health.",
    content: `
      <div class="article-content">
        <h2>The Sleep-Weight Connection</h2>
        <p>Sleep is often overlooked in weight loss discussions, but it plays a crucial role in regulating hormones that control hunger and metabolism.</p>
        
        <div class="info-box">
          <h3>Hormones Affected by Sleep</h3>
          <ul>
            <li><strong>Leptin:</strong> Signals fullness to the brain</li>
            <li><strong>Ghrelin:</strong> Stimulates hunger</li>
            <li><strong>Cortisol:</strong> Stress hormone that affects fat storage</li>
            <li><strong>Insulin:</strong> Regulates blood sugar and fat storage</li>
          </ul>
        </div>

        <h2>How Sleep Deprivation Affects Weight</h2>
        <p>Lack of sleep can sabotage your weight loss efforts in multiple ways.</p>
        
        <div class="sleep-effects">
          <h3>Effects of Poor Sleep</h3>
          <ul>
            <li>Increased hunger and appetite</li>
            <li>Reduced metabolism</li>
            <li>Poor food choices and cravings</li>
            <li>Decreased exercise motivation</li>
            <li>Impaired recovery from workouts</li>
          </ul>
        </div>

        <h2>Optimizing Sleep for Weight Loss</h2>
        <p>Creating a healthy sleep environment and routine can significantly improve your weight loss results.</p>
        
        <div class="sleep-tips">
          <h3>Sleep Optimization Tips</h3>
          <ul>
            <li>Maintain a consistent sleep schedule</li>
            <li>Create a relaxing bedtime routine</li>
            <li>Optimize your sleep environment</li>
            <li>Limit screen time before bed</li>
            <li>Avoid large meals close to bedtime</li>
          </ul>
        </div>

        <h2>Vitamin D and Weight Loss</h2>
        <p>Research suggests that adequate vitamin D levels may support weight loss efforts and prevent weight regain.</p>
        
        <div class="vitamin-d-weight-loss">
          <h3>How Vitamin D Supports Weight Loss</h3>
          <ul>
            <li>May reduce fat storage and increase fat breakdown</li>
            <li>Supports muscle function and strength</li>
            <li>Improves insulin sensitivity</li>
            <li>Reduces inflammation in the body</li>
            <li>Supports overall metabolic health</li>
          </ul>
        </div>
      </div>
    `,
    author: "Sleep Specialists",
    date: "2024-02-05",
    readTime: "6 min read",
    category: "Health & Wellness",
    image: "/BlogImg/bruce-mars-gJtDg6WfMlQ-unsplash.jpg",
    tags: ["sleep", "weight loss", "hormones", "health", "wellness"],
    seoDescription: "Learn how sleep affects weight loss and discover strategies to optimize your sleep for better health and weight management."
  },
  {
    id: 6,
    slug: "plateau-breaking-advanced-strategies-weight-loss",
    title: "Plateau Breaking: Advanced Strategies for Continued Weight Loss",
    excerpt: "When progress stalls, these advanced techniques can help you break through plateaus and continue your weight loss journey.",
    content: `
      <div class="article-content">
        <h2>Understanding Weight Loss Plateaus</h2>
        <p>Plateaus are a normal part of the weight loss journey, but they can be frustrating. Understanding why they occur helps you overcome them.</p>
        
        <div class="info-box">
          <h3>Why Plateaus Happen</h3>
          <ul>
            <li>Metabolic adaptation to reduced calories</li>
            <li>Loss of muscle mass reducing BMR</li>
            <li>Decreased NEAT (non-exercise activity)</li>
            <li>Water retention masking fat loss</li>
            <li>Hormonal changes affecting metabolism</li>
          </ul>
        </div>

        <h2>Advanced Plateau-Breaking Strategies</h2>
        <p>When traditional methods aren't working, these advanced strategies can help restart your progress.</p>
        
        <div class="plateau-strategies">
          <h3>Effective Plateau Breakers</h3>
          <ul>
            <li><strong>Reverse Dieting:</strong> Gradually increase calories to boost metabolism</li>
            <li><strong>Refeeds:</strong> Strategic higher-calorie days</li>
            <li><strong>Exercise Variation:</strong> Change your workout routine</li>
            <li><strong>Macro Cycling:</strong> Vary your macronutrient ratios</li>
            <li><strong>Stress Management:</strong> Reduce cortisol levels</li>
          </ul>
        </div>

        <h2>Tracking Beyond the Scale</h2>
        <p>Don't rely solely on weight to measure progress. Other metrics can show you're still making gains.</p>
        
        <div class="progress-metrics">
          <h3>Alternative Progress Indicators</h3>
          <ul>
            <li>Body measurements and circumference</li>
            <li>Progress photos</li>
            <li>Clothing fit and body composition</li>
            <li>Energy levels and performance</li>
            <li>Sleep quality and recovery</li>
          </ul>
        </div>
      </div>
    `,
    author: "Weight Loss Coaches",
    date: "2024-02-10",
    readTime: "9 min read",
    category: "Advanced Strategies",
    image: "/BlogImg/lyfefuel-4wtxPhvQZds-unsplash.jpg",
    tags: ["plateau", "weight loss", "advanced strategies", "progress", "motivation"],
    seoDescription: "Break through weight loss plateaus with advanced strategies. Learn techniques to restart progress and continue your weight loss journey."
  },
  {
    id: 7,
    slug: "metabolism-weight-loss-science-explained",
    title: "The Science of Weight Loss: Understanding Your Body's Metabolism",
    excerpt: "Discover how your metabolism works and learn evidence-based strategies to optimize it for sustainable weight loss.",
    content: `
      <div class="article-content">
        <h2>Understanding Your Metabolism</h2>
        <p>Your metabolism is the complex process by which your body converts food into energy. Understanding how it works is crucial for effective weight loss.</p>
        
        <div class="info-box">
          <h3>Key Metabolic Factors</h3>
          <ul>
            <li><strong>Basal Metabolic Rate (BMR):</strong> The calories your body burns at rest</li>
            <li><strong>Thermic Effect of Food:</strong> Energy used to digest and process food</li>
            <li><strong>Physical Activity:</strong> Calories burned through movement and exercise</li>
            <li><strong>Non-Exercise Activity Thermogenesis (NEAT):</strong> Daily activities like walking, fidgeting</li>
          </ul>
        </div>

        <h2>How to Boost Your Metabolism</h2>
        <p>Several factors influence your metabolic rate, and understanding these can help you optimize your weight loss journey.</p>
        
        <div class="data-table">
          <h3>Metabolism-Boosting Strategies</h3>
          <table>
            <thead>
              <tr>
                <th>Strategy</th>
                <th>Impact</th>
                <th>Implementation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Strength Training</td>
                <td>Increases muscle mass and BMR</td>
                <td>2-3 sessions per week</td>
              </tr>
              <tr>
                <td>High-Intensity Exercise</td>
                <td>Elevates metabolism for hours</td>
                <td>20-30 minutes, 3x weekly</td>
              </tr>
              <tr>
                <td>Protein-Rich Diet</td>
                <td>Higher thermic effect</td>
                <td>0.8-1.2g per kg body weight</td>
              </tr>
              <tr>
                <td>Adequate Sleep</td>
                <td>Maintains hormonal balance</td>
                <td>7-9 hours per night</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Common Metabolism Myths</h2>
        <p>There are many misconceptions about metabolism that can hinder your weight loss progress.</p>
        
        <div class="myth-fact">
          <div class="myth">
            <h4>❌ Myth: Eating late causes weight gain</h4>
            <p>It's not when you eat, but how much you eat that matters for weight loss.</p>
          </div>
          <div class="fact">
            <h4>✅ Fact: Total daily calories matter most</h4>
            <p>Focus on your overall daily caloric intake rather than meal timing.</p>
          </div>
        </div>

        <h2>Practical Tips for Metabolic Health</h2>
        <ul>
          <li>Stay hydrated - water is essential for metabolic processes</li>
          <li>Eat regular meals to maintain stable blood sugar</li>
          <li>Include fiber-rich foods to support gut health</li>
          <li>Manage stress levels to prevent cortisol-related weight gain</li>
          <li>Get regular physical activity throughout the day</li>
        </ul>
      </div>
    `,
    author: "Weight Loss Experts",
    date: "2024-02-15",
    readTime: "8 min read",
    category: "Science & Research",
    image: "/BlogImg/bruce-mars-gJtDg6WfMlQ-unsplash.jpg",
    tags: ["metabolism", "weight loss", "BMR", "exercise", "nutrition"],
    seoDescription: "Learn the science behind metabolism and weight loss. Discover how to optimize your body's energy systems for sustainable weight management results."
  },
  {
    id: 8,
    slug: "nutrition-basics-weight-loss-guide",
    title: "Nutrition Fundamentals for Sustainable Weight Loss",
    excerpt: "Master the basics of nutrition to create a sustainable eating plan that supports your weight loss goals.",
    content: `
      <div class="article-content">
        <h2>The Foundation of Good Nutrition</h2>
        <p>Understanding nutrition fundamentals is essential for creating a sustainable weight loss plan that works for your lifestyle.</p>
        
        <div class="info-box">
          <h3>Macronutrients Explained</h3>
          <ul>
            <li><strong>Proteins:</strong> Building blocks for muscle, 4 calories per gram</li>
            <li><strong>Carbohydrates:</strong> Primary energy source, 4 calories per gram</li>
            <li><strong>Fats:</strong> Essential for hormone production, 9 calories per gram</li>
          </ul>
        </div>

        <h2>Optimal Macronutrient Ratios for Weight Loss</h2>
        <p>Finding the right balance of macronutrients can significantly impact your weight loss success.</p>
        
        <div class="macronutrient-ratios">
          <h3>Recommended Ratios</h3>
          <ul>
            <li><strong>Protein:</strong> 25-30% of daily calories</li>
            <li><strong>Carbohydrates:</strong> 40-45% of daily calories</li>
            <li><strong>Fats:</strong> 25-30% of daily calories</li>
          </ul>
        </div>

        <h2>Meal Planning Strategies</h2>
        <p>Effective meal planning is key to maintaining a healthy diet and achieving your weight loss goals.</p>
        
        <div class="meal-planning-tips">
          <h3>Weekly Meal Planning Steps</h3>
          <ol>
            <li>Plan your meals for the entire week</li>
            <li>Create a shopping list based on your plan</li>
            <li>Prep ingredients in advance</li>
            <li>Cook in batches to save time</li>
            <li>Store meals in portion-controlled containers</li>
          </ol>
        </div>

        <h2>Mindful Eating Practices</h2>
        <p>Developing mindful eating habits can help you better understand your hunger cues and prevent overeating.</p>
        
        <div class="mindful-eating">
          <h3>Mindful Eating Techniques</h3>
          <ul>
            <li>Eat slowly and savor each bite</li>
            <li>Pay attention to hunger and fullness cues</li>
            <li>Eliminate distractions during meals</li>
            <li>Practice gratitude for your food</li>
            <li>Listen to your body's signals</li>
          </ul>
        </div>
      </div>
    `,
    author: "Nutrition Specialists",
    date: "2024-02-20",
    readTime: "10 min read",
    category: "Nutrition",
    image: "/BlogImg/lyfefuel-4wtxPhvQZds-unsplash.jpg",
    tags: ["nutrition", "macronutrients", "weight loss", "healthy eating", "meal planning"],
    seoDescription: "Master the fundamentals of nutrition for sustainable weight loss. Learn about macronutrients, meal timing, and optimal food choices."
  },
  {
    id: 9,
    slug: "sunlight-wellness-vitamin-d-mental-health",
    title: "Sunlight for Wellness: Vitamin D & Mental Health",
    excerpt: "Discover the crucial connection between vitamin D, sunlight exposure, and your mental health during weight loss.",
    content: `
      <div class="article-content">
        <h2>The Vitamin D Connection</h2>
        <p>Vitamin D, often called the "sunshine vitamin," plays a crucial role in both physical and mental health, especially during weight loss journeys.</p>
        
        <div class="info-box">
          <h3>Vitamin D Benefits</h3>
          <ul>
            <li><strong>Mood Regulation:</strong> Supports serotonin production</li>
            <li><strong>Immune Function:</strong> Strengthens immune system</li>
            <li><strong>Bone Health:</strong> Essential for calcium absorption</li>
            <li><strong>Weight Management:</strong> May influence fat storage</li>
          </ul>
        </div>

        <h2>Sunlight and Mental Health</h2>
        <p>Regular exposure to natural sunlight has profound effects on mental well-being and can support your weight loss motivation.</p>
        
        <div class="sunlight-benefits">
          <h3>Mental Health Benefits</h3>
          <ul>
            <li>Improved mood and reduced depression</li>
            <li>Better sleep quality and circadian rhythm</li>
            <li>Reduced stress and anxiety levels</li>
            <li>Increased energy and motivation</li>
            <li>Enhanced cognitive function</li>
          </ul>
        </div>

        <h2>Optimizing Sunlight Exposure</h2>
        <p>Getting the right amount of sunlight is crucial for vitamin D production and overall wellness.</p>
        
        <div class="sunlight-tips">
          <h3>Safe Sunlight Practices</h3>
          <ul>
            <li>Aim for 10-30 minutes of midday sun exposure</li>
            <li>Expose arms, legs, and face when possible</li>
            <li>Consider your skin type and location</li>
            <li>Use sunscreen after initial exposure</li>
            <li>Get outside during winter months too</li>
          </ul>
        </div>

        <h2>Vitamin D and Weight Loss</h2>
        <p>Research suggests that adequate vitamin D levels may support weight loss efforts and prevent weight regain.</p>
        
        <div class="vitamin-d-weight-loss">
          <h3>How Vitamin D Supports Weight Loss</h3>
          <ul>
            <li>May reduce fat storage and increase fat breakdown</li>
            <li>Supports muscle function and strength</li>
            <li>Improves insulin sensitivity</li>
            <li>Reduces inflammation in the body</li>
            <li>Supports overall metabolic health</li>
          </ul>
        </div>
      </div>
    `,
    author: "Health & Wellness Experts",
    date: "2024-02-25",
    readTime: "7 min read",
    category: "Health & Wellness",
    image: "/BlogImg/bruce-mars-gJtDg6WfMlQ-unsplash.jpg",
    tags: ["vitamin d", "sunlight", "mental health", "wellness", "weight loss"],
    seoDescription: "Learn about the connection between vitamin D, sunlight exposure, and mental health during your weight loss journey."
  },
  {
    id: 10,
    slug: "intermittent-fasting-weight-loss-complete-guide",
    title: "Intermittent Fasting: A Complete Guide to Weight Loss Success",
    excerpt: "Master the art of intermittent fasting with proven strategies for sustainable weight loss and improved health.",
    content: `
      <div class="article-content">
        <h2>Understanding Intermittent Fasting</h2>
        <p>Intermittent fasting (IF) is an eating pattern that cycles between periods of fasting and eating. It's not about what you eat, but when you eat.</p>
        
        <div class="info-box">
          <h3>Popular IF Methods</h3>
          <ul>
            <li><strong>16:8 Method:</strong> 16 hours fasting, 8 hours eating window</li>
            <li><strong>5:2 Method:</strong> 5 days normal eating, 2 days restricted calories</li>
            <li><strong>Eat-Stop-Eat:</strong> 24-hour fast once or twice per week</li>
            <li><strong>Alternate Day Fasting:</strong> Fasting every other day</li>
          </ul>
        </div>

        <h2>How Intermittent Fasting Promotes Weight Loss</h2>
        <p>IF works through several mechanisms that support fat burning and weight loss.</p>
        
        <div class="data-table">
          <h3>Weight Loss Benefits of IF</h3>
          <table>
            <thead>
              <tr>
                <th>Benefit</th>
                <th>Mechanism</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Reduced Calorie Intake</td>
                <td>Shorter eating window</td>
                <td>Natural calorie deficit</td>
              </tr>
              <tr>
                <td>Increased Fat Burning</td>
                <td>Lower insulin levels</td>
                <td>Enhanced fat oxidation</td>
              </tr>
              <tr>
                <td>Improved Metabolism</td>
                <td>Hormonal changes</td>
                <td>Better energy utilization</td>
              </tr>
              <tr>
                <td>Reduced Inflammation</td>
                <td>Cellular repair processes</td>
                <td>Better overall health</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Getting Started with Intermittent Fasting</h2>
        <p>Begin with a simple approach and gradually increase the fasting duration.</p>
        
        <div class="if-guide">
          <h3>Step-by-Step IF Guide</h3>
          <ol>
            <li><strong>Start Slow:</strong> Begin with 12:12 (12 hours fasting)</li>
            <li><strong>Gradually Increase:</strong> Move to 14:10, then 16:8</li>
            <li><strong>Stay Hydrated:</strong> Drink plenty of water during fasts</li>
            <li><strong>Listen to Your Body:</strong> Adjust based on how you feel</li>
            <li><strong>Be Consistent:</strong> Stick to your chosen schedule</li>
          </ol>
        </div>

        <h2>What to Eat During Your Eating Window</h2>
        <p>Focus on nutrient-dense foods to maximize the benefits of IF.</p>
        
        <div class="meal-suggestions">
          <h3>Optimal Food Choices</h3>
          <ul>
            <li><strong>Proteins:</strong> Lean meats, fish, eggs, legumes</li>
            <li><strong>Healthy Fats:</strong> Avocados, nuts, olive oil</li>
            <li><strong>Complex Carbs:</strong> Whole grains, vegetables</li>
            <li><strong>Fiber:</strong> Fruits, vegetables, seeds</li>
          </ul>
        </div>
      </div>
    `,
    author: "Nutrition & Fasting Experts",
    date: "2024-03-01",
    readTime: "11 min read",
    category: "Fasting & Nutrition",
    image: "/BlogImg/bruce-mars-gJtDg6WfMlQ-unsplash.jpg",
    tags: ["intermittent fasting", "weight loss", "nutrition", "health", "metabolism"],
    seoDescription: "Master intermittent fasting for weight loss success. Learn proven strategies, methods, and tips for sustainable results."
  },
  {
    id: 11,
    slug: "stress-management-weight-loss-connection",
    title: "Stress Management: The Missing Link in Your Weight Loss Journey",
    excerpt: "Discover how stress affects your weight loss efforts and learn effective strategies to manage it for better results.",
    content: `
      <div class="article-content">
        <h2>The Stress-Weight Connection</h2>
        <p>Chronic stress can sabotage your weight loss efforts through hormonal changes and behavioral patterns.</p>
        
        <div class="info-box">
          <h3>How Stress Affects Weight Loss</h3>
          <ul>
            <li><strong>Cortisol Production:</strong> Increases fat storage, especially around the abdomen</li>
            <li><strong>Appetite Changes:</strong> Can lead to emotional eating and cravings</li>
            <li><strong>Sleep Disruption:</strong> Affects metabolism and recovery</li>
            <li><strong>Reduced Motivation:</strong> Makes it harder to stick to healthy habits</li>
          </ul>
        </div>

        <h2>Stress Hormones and Weight Gain</h2>
        <p>Understanding the hormonal response to stress helps explain why weight loss becomes difficult.</p>
        
        <div class="stress-hormones">
          <h3>Key Stress Hormones</h3>
          <ul>
            <li><strong>Cortisol:</strong> Primary stress hormone that promotes fat storage</li>
            <li><strong>Adrenaline:</strong> Increases heart rate and energy expenditure</li>
            <li><strong>Insulin:</strong> Can become less effective under chronic stress</li>
            <li><strong>Leptin:</strong> Hunger hormone that can be disrupted by stress</li>
          </ul>
        </div>

        <h2>Effective Stress Management Techniques</h2>
        <p>Implementing stress management strategies can significantly improve your weight loss results.</p>
        
        <div class="stress-techniques">
          <h3>Proven Stress Reduction Methods</h3>
          <ul>
            <li><strong>Mindfulness Meditation:</strong> 10-20 minutes daily practice</li>
            <li><strong>Deep Breathing:</strong> 4-7-8 breathing technique</li>
            <li><strong>Regular Exercise:</strong> Natural stress reliever</li>
            <li><strong>Quality Sleep:</strong> 7-9 hours per night</li>
            <li><strong>Social Connection:</strong> Spend time with loved ones</li>
          </ul>
        </div>

        <h2>Creating a Stress-Free Environment</h2>
        <p>Your environment plays a crucial role in managing stress levels.</p>
        
        <div class="environment-tips">
          <h3>Environment Optimization</h3>
          <ul>
            <li>Create a calming home environment</li>
            <li>Limit exposure to negative news and social media</li>
            <li>Establish regular routines and schedules</li>
            <li>Practice time management to reduce overwhelm</li>
            <li>Incorporate nature and outdoor activities</li>
          </ul>
        </div>
      </div>
    `,
    author: "Mental Health & Wellness Experts",
    date: "2024-03-05",
    readTime: "9 min read",
    category: "Mental Health & Wellness",
    image: "/BlogImg/lyfefuel-4wtxPhvQZds-unsplash.jpg",
    tags: ["stress management", "weight loss", "mental health", "cortisol", "wellness"],
    seoDescription: "Learn how stress affects weight loss and discover effective stress management techniques for better weight loss results."
  },
  {
    id: 12,
    slug: "gut-health-weight-loss-microbiome",
    title: "Gut Health and Weight Loss: The Microbiome Connection",
    excerpt: "Explore the fascinating connection between your gut microbiome and weight loss success.",
    content: `
      <div class="article-content">
        <h2>The Gut Microbiome and Weight Loss</h2>
        <p>Your gut contains trillions of bacteria that play a crucial role in metabolism, appetite regulation, and weight management.</p>
        
        <div class="info-box">
          <h3>How the Microbiome Affects Weight</h3>
          <ul>
            <li><strong>Metabolism Regulation:</strong> Influences how you process food</li>
            <li><strong>Appetite Control:</strong> Affects hunger and satiety signals</li>
            <li><strong>Energy Extraction:</strong> Determines how many calories you absorb</li>
            <li><strong>Inflammation:</strong> Can cause weight gain through chronic inflammation</li>
          </ul>
        </div>

        <h2>Gut Bacteria and Weight Management</h2>
        <p>Different types of bacteria in your gut can either support or hinder weight loss efforts.</p>
        
        <div class="bacteria-types">
          <h3>Beneficial vs. Harmful Bacteria</h3>
          <div class="bacteria-comparison">
            <div class="beneficial">
              <h4>Weight-Loss Friendly Bacteria</h4>
              <ul>
                <li>Bifidobacterium</li>
                <li>Lactobacillus</li>
                <li>Akkermansia muciniphila</li>
                <li>Faecalibacterium prausnitzii</li>
              </ul>
            </div>
            <div class="harmful">
              <h4>Weight-Gain Associated Bacteria</h4>
              <ul>
                <li>Firmicutes (in excess)</li>
                <li>Enterobacter</li>
                <li>Escherichia coli (certain strains)</li>
              </ul>
            </div>
          </div>
        </div>

        <h2>Improving Gut Health for Weight Loss</h2>
        <p>Several strategies can help optimize your gut microbiome for better weight management.</p>
        
        <div class="gut-health-strategies">
          <h3>Gut Health Optimization</h3>
          <ul>
            <li><strong>Eat More Fiber:</strong> 25-30 grams daily from whole foods</li>
            <li><strong>Include Probiotics:</strong> Yogurt, kefir, sauerkraut, kimchi</li>
            <li><strong>Prebiotic Foods:</strong> Garlic, onions, bananas, asparagus</li>
            <li><strong>Diverse Diet:</strong> Eat a wide variety of plant foods</li>
            <li><strong>Limit Processed Foods:</strong> Reduce artificial additives</li>
          </ul>
        </div>

        <h2>Signs of Poor Gut Health</h2>
        <p>Recognizing the symptoms of an unhealthy gut can help you take action.</p>
        
        <div class="gut-symptoms">
          <h3>Common Gut Health Issues</h3>
          <ul>
            <li>Digestive problems (bloating, gas, constipation)</li>
            <li>Food intolerances and sensitivities</li>
            <li>Unexplained weight gain or difficulty losing weight</li>
            <li>Fatigue and low energy levels</li>
            <li>Skin problems and inflammation</li>
            <li>Mood changes and brain fog</li>
          </ul>
        </div>
      </div>
    `,
    author: "Gut Health & Nutrition Specialists",
    date: "2024-03-10",
    readTime: "10 min read",
    category: "Gut Health & Nutrition",
    image: "/BlogImg/bruce-mars-tj27cwu86Wk-unsplash.jpg",
    tags: ["gut health", "microbiome", "weight loss", "probiotics", "nutrition"],
    seoDescription: "Discover the connection between gut health and weight loss. Learn how to optimize your microbiome for better weight management."
  }
];

const BlogPost = () => {
  const { blogSlug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const foundPost = blogPosts.find(p => p.slug === blogSlug);
    setPost(foundPost);
  }, [blogSlug]);

  const handleShare = async () => {
    if (isSharing) return; // Prevent multiple share requests
    
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
        // Fallback to clipboard copy
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
        } catch (clipboardError) {
          alert('Unable to share or copy link. Please copy the URL manually.');
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleBookmark = () => {
    if (window.sidebar && window.sidebar.addPanel) {
      window.sidebar.addPanel(post.title, window.location.href, '');
    } else {
      alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
          <button
            onClick={() => navigate('/blog')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white max-w-5xl mx-auto px-6">
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
      <div className="blog-post-container py-12">
        <div className="blog-post-content">
          {/* Main Content */}
          <div className="blog-post-main">
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
          <div className="blog-post-sidebar">
            <div className="space-y-6">
              {/* Share Buttons */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Share This Article</h3>
                <div className="flex gap-3">
                  <button 
                    onClick={handleShare}
                    disabled={isSharing}
                    className="share-button flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Share2 className="h-4 w-4" />
                    {isSharing ? 'Sharing...' : 'Share'}
                  </button>
                  <button 
                    onClick={handleBookmark}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
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
      <div className="blog-post-container pb-12">
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