
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ icon, title, description, className }: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "premium-card p-4 sm:p-6 flex flex-col items-center",
        "animate-slide-up opacity-0",
        "hover:translate-y-[-5px]",
        className
      )}
      style={{
        animationDelay: '0.1s',
        animationFillMode: 'forwards'
      }}
    >
      <div className="rounded-full bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="text-quiz-primary">{icon}</div>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-quiz-dark mb-2 sm:mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default FeatureCard;
