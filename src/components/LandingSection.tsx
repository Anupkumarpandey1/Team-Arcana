
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Youtube, CheckCircle2, Sparkles, Lightbulb, Zap } from 'lucide-react';
import FeatureCard from './FeatureCard';
import StepCard from './StepCard';
import ThreeDModel from './ThreeDModel';

interface LandingSectionProps {
  onGetStarted: () => void;
}

const LandingSection = ({ onGetStarted }: LandingSectionProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12 md:mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-left"
        >
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-quiz-primary/10 text-quiz-primary">
            <Sparkles size={16} className="mr-2" />
            <span className="font-medium">AI-Powered Learning</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 gradient-text">
            Master Any Topic with AI Quizzes
          </h1>
          <p className="text-base md:text-xl text-gray-600 mb-6 sm:mb-10">
            Transform videos, documents, or any topic into interactive quizzes. Boost your learning with our AI-powered quiz generator and chat with our Master Teacher for personalized help.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.button
              onClick={onGetStarted}
              className="premium-button text-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Battleground
            </motion.button>
            <motion.a
              href="https://quiznect-genius.learnflow.app/"
              className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Barrack
            </motion.a>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <ThreeDModel />
        </motion.div>
      </div>

      <motion.div
        id="features"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-quiz-secondary/10 text-quiz-secondary">
          <Zap size={16} className="mr-2" />
          <span className="font-medium">Powerful Features</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Unlock Your Learning Potential</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          Our platform combines AI technology with proven learning methods to help you master any subject more effectively than traditional studying.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-16 sm:mb-24">
        <FeatureCard
          icon={<Brain className="w-8 h-8" />}
          title="AI-Generated Questions"
          description="Our advanced AI creates tailored questions based on your chosen topic or content"
        />
        <FeatureCard
          icon={<Youtube className="w-8 h-8" />}
          title="YouTube Integration"
          description="Generate quizzes directly from YouTube videos to test comprehension"
        />
        <FeatureCard
          icon={<CheckCircle2 className="w-8 h-8" />}
          title="Detailed Explanations"
          description="Get comprehensive explanations for correct answers to enhance learning"
        />
        <FeatureCard
          icon={<Lightbulb className="w-8 h-8" />}
          title="Master Teacher AI"
          description="Chat with our AI teacher to get personalized explanations and insights on any topic"
        />
        <FeatureCard
          icon={<Zap className="w-8 h-8" />}
          title="PDF & Image Analysis"
          description="Upload documents and images to generate quizzes from your study materials"
        />
        <FeatureCard
          icon={<Sparkles className="w-8 h-8" />}
          title="Adaptive Learning"
          description="Our quizzes adapt to your knowledge level, focusing on areas where you need improvement"
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-quiz-primary/5 to-quiz-secondary/5 rounded-3xl transform rotate-1"></div>
        <motion.div 
          className="relative bg-white rounded-3xl shadow-xl p-6 sm:p-10 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 gradient-text">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <StepCard number={1} title="Choose Your Input" description="Enter a topic, paste a YouTube URL, or upload a document" />
            <StepCard number={2} title="Customize" description="Set the number of questions and options" />
            <StepCard number={3} title="Generate & Learn" description="Get your personalized quiz instantly" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mt-16 sm:mt-24 mb-8 sm:mb-12"
      >
        <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-quiz-primary/10 text-quiz-primary">
          <Sparkles size={16} className="mr-2" />
          <span className="font-medium">Start Learning Now</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Ready to Transform Your Learning?</h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8">
          Join thousands of students who are accelerating their learning with our AI-powered quiz platform.
        </p>
        <motion.button
          onClick={onGetStarted}
          className="premium-button text-lg font-medium px-6 sm:px-8 py-3 sm:py-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Get Started Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LandingSection;
