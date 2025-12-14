import React from 'react';
import { LoyaltyConfig } from '../types';

interface LoyaltyCardProps {
  visits: number;
  config: LoyaltyConfig;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ visits, config }) => {
  if (!config.enabled) return null;

  const currentProgress = visits % config.threshold;
  const remaining = config.threshold - currentProgress;
  const stamps = Array.from({ length: config.threshold }, (_, i) => i + 1);
  const isRewardReady = currentProgress === 0 && visits > 0;

  return (
    <div className="mx-4 mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-orange-50/50 to-orange-100/50 dark:from-zinc-900 dark:via-orange-950/10 dark:to-orange-900/20 border border-orange-200 dark:border-orange-900/30 shadow-lg group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/5 dark:bg-orange-400/10 rounded-full blur-2xl -ml-6 -mb-6"></div>
      
      <div className="p-4 relative z-10">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-orange-600 dark:text-orange-500 font-bold text-sm tracking-wider uppercase flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Fidelidade
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5 font-medium">
              {isRewardReady 
                ? "Recompensa Liberada!" 
                : `${remaining} ${remaining === 1 ? 'visita' : 'visitas'} para ganhar`}
            </p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 dark:border-orange-500/20 shadow-sm">
            {visits} Visitas
          </div>
        </div>

        {/* Stamps Grid */}
        <div className="flex justify-between items-center gap-1.5 mt-2">
          {stamps.map((num) => {
            const isFilled = num <= currentProgress || (isRewardReady && currentProgress === 0);
            return (
              <div 
                key={num} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  isFilled ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-zinc-200 dark:bg-zinc-800'
                }`}
              />
            );
          })}
        </div>
        
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRewardReady ? "text-orange-500" : "text-zinc-400 dark:text-zinc-600"}>
             <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
             <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
             <path d="M4 22h16"></path>
             <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
             <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
             <path d="M18 2h-4a4 4 0 0 0-4 4v9h12V6a4 4 0 0 0-4-4Z"></path>
           </svg>
           <span>Meta: <span className="text-zinc-700 dark:text-zinc-300 font-medium">{config.rewardDescription}</span></span>
        </div>
      </div>
    </div>
  );
};