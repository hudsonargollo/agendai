import React, { useState } from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: (service: Service) => void;
  isHighlight?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, isSelected, onToggle, isHighlight }) => {
  const [expanded, setExpanded] = useState(false);
  const isPackage = service.category === 'Packages' || service.category === 'Combos';

  return (
    <div 
      className={`relative p-4 mb-3 rounded-2xl transition-all duration-300 border group ${
        isSelected 
          ? 'bg-zinc-50 dark:bg-zinc-800/80 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]' 
          : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'
      }`}
      onClick={() => onToggle(service)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className={`font-semibold text-lg leading-tight ${isSelected ? 'text-red-600 dark:text-red-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
              {service.name}
            </h3>
            {isPackage && !isHighlight && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20">
                Combo
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-2">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 dark:text-zinc-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {service.duration} min
            </div>
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
            <div className="text-zinc-700 dark:text-zinc-300">R$ {service.price}</div>
          </div>
          
          <div 
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
               <div className="text-sm text-zinc-500 dark:text-zinc-500 pb-3 leading-relaxed">
                 {service.description}
               </div>
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-xs text-zinc-500 dark:text-zinc-600 font-medium hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1"
          >
            {expanded ? 'Menos info' : 'Mais info'}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center pt-1">
          <button
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSelected 
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 scale-105' 
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 group-hover:text-zinc-600 dark:group-hover:text-zinc-200'
            }`}
          >
            {isSelected ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};