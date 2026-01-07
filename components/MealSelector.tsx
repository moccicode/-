
import React from 'react';
import { MealTime } from '../types';

interface MealSelectorProps {
  selectedMeal: MealTime;
  onSelect: (meal: MealTime) => void;
}

const MealSelector: React.FC<MealSelectorProps> = ({ selectedMeal, onSelect }) => {
  const options = [
    { value: MealTime.BREAKFAST, icon: '🌅', label: '아침' },
    { value: MealTime.LUNCH, icon: '☀️', label: '점심' },
    { value: MealTime.DINNER, icon: '🌙', label: '저녁' },
  ];

  return (
    <div className="flex gap-4 justify-center">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 w-28 h-32 ${
            selectedMeal === option.value
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md transform scale-105'
              : 'border-slate-200 bg-white text-slate-400 hover:border-emerald-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-3xl mb-2">{option.icon}</span>
          <span className="font-bold">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MealSelector;
