import React, { useState } from 'react';
import { Service } from '../types';

interface SmartCartProps {
  cart: Service[];
  onContinue: () => void;
  onRemoveItem?: (service: Service) => void;
  label?: string;
}

export const SmartCart: React.FC<SmartCartProps> = ({ cart, onContinue, onRemoveItem, label = "Continuar" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (cart.length === 0) return null;

  const totalDuration = cart.reduce((acc, curr) => acc + curr.duration, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + curr.price, 0);
  const count = cart.length;

  // Format duration nicely
  const hours = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;
  const durationString = hours > 0 
    ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}` 
    : `${mins} min`;

  return (
    <>
      {/* Expanded Cart Details Modal (Bottom Sheet) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" 
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="absolute bottom-28 left-4 right-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-2xl animate-fade-in-up" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-zinc-900 dark:text-white text-sm uppercase tracking-wide">Seu Carrinho</h3>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                  <div className="flex-1 pr-4">
                    <div className="text-zinc-900 dark:text-zinc-200 font-semibold text-sm">{item.name}</div>
                    <div className="text-zinc-500 text-xs flex items-center gap-2 mt-0.5">
                      <span>R$ {item.price}</span>
                      <span className="w-0.5 h-0.5 bg-zinc-400 dark:bg-zinc-600 rounded-full"></span>
                      <span>{item.duration} min</span>
                    </div>
                  </div>
                  {onRemoveItem && (
                    <button 
                      onClick={() => {
                        onRemoveItem(item);
                        if(cart.length <= 1) setIsOpen(false);
                      }}
                      className="text-red-500 p-2 hover:bg-red-500/10 rounded-full transition-colors flex-shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Cart Bar */}
      <div className="fixed bottom-6 left-4 right-4 z-50 animate-fade-in-up">
        <div className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-medium h-[4.5rem] rounded-[2rem] shadow-2xl flex items-stretch overflow-hidden relative">
          
          {/* Left Side: Toggle Details */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col items-start justify-center pl-5 pr-2 flex-1 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-left group active:bg-zinc-800 dark:active:bg-zinc-200"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {count} {count === 1 ? 'Serviço' : 'Serviços'}
              </span>
              <div className={`text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm pl-1 mt-0.5">
              <span className="font-semibold">{durationString}</span>
              <span className="w-1 h-1 bg-zinc-600 dark:bg-zinc-300 rounded-full"></span>
              <span className="font-semibold text-zinc-300 dark:text-zinc-600">R$ {totalPrice}</span>
            </div>
          </button>

          {/* Divider */}
          <div className="my-auto h-8 w-[1px] bg-zinc-700 dark:bg-zinc-200"></div>

          {/* Right Side: Action */}
          <button 
             onClick={onContinue}
             className="px-6 flex items-center gap-2 font-bold text-base hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors active:text-zinc-300 dark:active:text-zinc-700"
          >
            {label}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};