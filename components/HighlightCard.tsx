import React, { useState } from 'react';
import { Service } from '../types';

interface HighlightCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: (service: Service) => void;
}

export const HighlightCard: React.FC<HighlightCardProps> = ({ service, isSelected, onToggle }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Fallback gradient if no image
  const bgStyle = service.imageUrl 
    ? { backgroundImage: `url(${service.imageUrl})` }
    : { background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)' };

  return (
    <div 
      className={`relative flex-none w-[280px] h-[160px] rounded-2xl overflow-hidden snap-center cursor-pointer group shadow-lg hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 ease-out border ${isSelected ? 'border-red-500' : 'border-transparent hover:border-red-500/50'}`}
      onClick={() => {
        // If selecting (not already selected), automatically show info
        if (!isSelected) {
            onToggle(service);
            setShowInfo(true);
        } else {
            // If already selected and info is closed, toggle it off
            if (!showInfo) onToggle(service);
        }
      }}
    >
      {/* Background Image with Zoom Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
        style={bgStyle}
      />
      
      {/* Dark Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-500 ${isSelected ? 'opacity-90' : 'opacity-70 group-hover:opacity-60'}`} />

      {/* Selected Border/Overlay */}
      <div className={`absolute inset-0 border-[3px] border-red-500 rounded-2xl z-20 pointer-events-none transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />

      {/* Info Button (Top Right) */}
      <button 
        className={`absolute top-3 right-3 z-30 w-8 h-8 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border ${showInfo ? 'bg-white text-black border-white' : 'bg-black/30 text-zinc-300 border-white/10 hover:bg-black/50 hover:text-white'}`}
        onClick={(e) => {
          e.stopPropagation();
          setShowInfo(!showInfo);
        }}
      >
        {showInfo ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        )}
      </button>

      {/* Info Overlay (Details) - Sliding Up - Always keep dark theme for this specific overlay to match the "highlight" aesthetic */}
      <div 
        className={`absolute inset-0 bg-zinc-950/95 backdrop-blur-xl z-20 p-5 flex flex-col transition-all duration-500 cubic-bezier(0.33, 1, 0.68, 1) ${
            showInfo ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto pr-1">
            <h3 className="text-white font-bold text-lg leading-tight mb-2">{service.name}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
                {service.description}
            </p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
             <div className="text-xs text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 
                    {service.duration} min
                </div>
                <div className="text-zinc-500">Valor Total</div>
             </div>
             
             <div className="flex items-center gap-3">
                 <span className="font-bold text-white text-lg">R$ {service.price}</span>
                 <button 
                    onClick={() => onToggle(service)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                        isSelected 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                 >
                    {isSelected ? 'Remover' : 'Adicionar'}
                 </button>
             </div>
        </div>
      </div>

      {/* Main Content (Bottom) */}
      <div className={`absolute inset-0 p-4 flex flex-col justify-end z-10 transition-all duration-500 delay-75 ${showInfo ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        <div className="flex justify-between items-end gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600/90 text-white px-1.5 py-0.5 rounded shadow-sm backdrop-blur-md">
                Destaque
              </span>
              {isSelected && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 text-red-600 px-1.5 py-0.5 rounded shadow-sm backdrop-blur-md">
                  Selecionado
                </span>
              )}
            </div>
            <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg line-clamp-2 pr-6 group-hover:text-red-100 transition-colors">
              {service.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-zinc-300 text-xs font-medium drop-shadow-md">
               <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {service.duration}m</span>
               <span className="w-0.5 h-0.5 bg-zinc-400 rounded-full"></span>
               <span>{service.description.split('.')[0]}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="text-white font-bold text-lg drop-shadow-lg">
               R$ {service.price}
             </div>
             <div 
               className={`w-8 h-8 rounded-full flex items-center justify-center mt-1.5 transition-all duration-300 ${
                 isSelected ? 'bg-red-600 text-white scale-110 shadow-lg shadow-red-600/40' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30 group-hover:bg-red-500 group-hover:text-white'
               }`}
             >
                {isSelected ? (
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};