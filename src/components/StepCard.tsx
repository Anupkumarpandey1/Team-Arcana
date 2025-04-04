
import React from 'react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  className?: string;
}

const StepCard = ({ number, title, description, className }: StepCardProps) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center text-center",
        "animate-slide-up opacity-0",
        className
      )}
      style={{
        animationDelay: `${0.2 + (number * 0.1)}s`,
        animationFillMode: 'forwards'
      }}
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-quiz-primary to-quiz-secondary text-white 
                     flex items-center justify-center text-xl font-bold mb-5
                     shadow-lg transition-transform duration-300 hover:scale-110">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-quiz-dark mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default StepCard;
