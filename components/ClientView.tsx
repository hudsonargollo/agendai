import React, { useState, useEffect, useRef } from 'react';
import { MOCK_PROVIDER, TIME_SLOTS } from '../constants';
import { Service, TimeSlot, Professional } from '../types';
import { ServiceCard } from './ServiceCard';
import { HighlightCard } from './HighlightCard';
import { SmartCart } from './SmartCart';
import { AIChat } from './AIChat';
import { LoyaltyCard } from './LoyaltyCard';
import { ProfessionalCard } from './ProfessionalCard';

interface ClientViewProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ClientView: React.FC<ClientViewProps> = ({ isDarkMode, toggleTheme }) => {
  const [cart, setCart] = useState<Service[]>([]);
  const [step, setStep] = useState<'services' | 'professional' | 'calendar' | 'identify' | 'success'>('services');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // User Identity State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Mock User State (starts at 9, but would be fetched based on phone in real app)
  const [visits, setVisits] = useState(9);
  const [rewardUnlocked, setRewardUnlocked] = useState(false);

  // Auto-scroll logic for Highlights slideshow
  useEffect(() => {
    // Entrance animation delay
    const entranceTimer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0 });
      }
    }, 100);

    // Auto-slide to the right after 1500ms
    const slideTimer = setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 1500);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(slideTimer);
    };
  }, []);

  // If cart becomes empty while in booking flow, go back to services
  useEffect(() => {
    if (cart.length === 0 && step !== 'services' && step !== 'success') {
      setStep('services');
    }
  }, [cart, step]);

  const toggleService = (service: Service) => {
    setCart(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const totalDuration = cart.reduce((acc, curr) => acc + curr.duration, 0);

  // Move from Calendar to Identification
  const initiateBooking = () => {
    setStep('identify');
  };

  // Finalize booking after Identification
  const completeBooking = () => {
    if (!customerName || !customerPhone) return;

    // Simulate API call and Logic
    // In a real app, we would send customerPhone to backend to track rewards
    console.log("Booking for:", { customerName, customerPhone, cart, selectedSlot });

    setTimeout(() => {
      // Increment visits
      const newVisitCount = visits + 1;
      setVisits(newVisitCount);
      
      // Check for reward unlock
      if (MOCK_PROVIDER.loyaltyProgram?.enabled && newVisitCount % MOCK_PROVIDER.loyaltyProgram.threshold === 0) {
        setRewardUnlocked(true);
      } else {
        setRewardUnlocked(false);
      }

      setStep('success');
    }, 800);
  };

  // Format Phone Number as user types (Simple mask)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 11) value = value.slice(0, 11); // Max 11 digits (BR format)
    
    // Simple formatting (XX) XXXXX-XXXX
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    setCustomerPhone(value);
  };

  // Separate Combos as Highlights, prioritizing ones with images
  const highlights = MOCK_PROVIDER.services
    .filter(s => s.category === 'Combos')
    .sort((a, b) => (b.imageUrl ? 1 : 0) - (a.imageUrl ? 1 : 0));

  // Get other categories, excluding Combos
  const categories = Array.from(new Set(MOCK_PROVIDER.services.map(s => s.category))).filter(c => c !== 'Combos');

  if (step === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-gray-50 dark:bg-zinc-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-600/20 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-500">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Agendado!</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-2 max-w-xs">
          Olá <strong>{customerName.split(' ')[0]}</strong>! Seu agendamento foi confirmado para Hoje às {selectedSlot?.time}.
        </p>
        <p className="text-zinc-500 text-sm mb-6">
           Com: <span className="text-zinc-800 dark:text-zinc-300 font-medium">{selectedProfessional?.name}</span>
        </p>

        {rewardUnlocked && MOCK_PROVIDER.loyaltyProgram && (
          <div className="w-full max-w-xs bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-xl p-4 mb-8 animate-pulse">
            <h3 className="text-orange-600 dark:text-orange-500 font-bold text-lg mb-1 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2h-4a4 4 0 0 0-4 4v9h12V6a4 4 0 0 0-4-4Z"/></svg>
              Recompensa Desbloqueada!
            </h3>
            <p className="text-orange-700 dark:text-orange-200/80 text-sm">
              Você completou {visits} visitas! Um voucher de <strong>{MOCK_PROVIDER.loyaltyProgram.rewardDescription}</strong> foi enviado para seu WhatsApp ({customerPhone}).
            </p>
          </div>
        )}

        <button 
          onClick={() => {
            setCart([]);
            setSelectedSlot(null);
            setSelectedProfessional(null);
            // Optionally clear user data, or keep it for "session"
            setStep('services');
          }}
          className="bg-zinc-900 dark:bg-zinc-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-700 transition"
        >
          Novo Agendamento
        </button>
      </div>
    );
  }

  if (step === 'identify') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 transition-colors duration-300">
        <div className="sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
          <button 
            onClick={() => setStep('calendar')}
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-800"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900 dark:text-zinc-100">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Identificação</h2>
        </div>

        <div className="p-6 flex-1 flex flex-col max-w-sm mx-auto w-full">
           <div className="mb-8 mt-4 text-center">
             <div className="w-16 h-16 bg-red-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-white">
                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                 <circle cx="12" cy="7" r="4"></circle>
               </svg>
             </div>
             <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Quem é você?</h2>
             <p className="text-zinc-500 dark:text-zinc-400 text-sm">
               Precisamos do seu WhatsApp para pontuar no programa de fidelidade e enviar a confirmação.
             </p>
           </div>

           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Seu Nome</label>
               <input 
                 type="text" 
                 value={customerName}
                 onChange={(e) => setCustomerName(e.target.value)}
                 placeholder="Ex: João Silva"
                 className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white placeholder:text-zinc-400 transition-all"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">WhatsApp</label>
               <div className="relative">
                 <input 
                   type="tel" 
                   value={customerPhone}
                   onChange={handlePhoneChange}
                   placeholder="(00) 00000-0000"
                   className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white placeholder:text-zinc-400 transition-all"
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                 </div>
               </div>
             </div>
           </div>

           <div className="mt-8">
             <button 
               onClick={completeBooking}
               disabled={!customerName || customerPhone.length < 14} // Simple validation length
               className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Confirmar Agendamento
             </button>
             <p className="text-center text-xs text-zinc-400 mt-4">
               Ao continuar, você concorda em receber mensagens sobre seu agendamento.
             </p>
           </div>
        </div>
      </div>
    );
  }

  if (step === 'professional') {
    return (
      <div className="min-h-screen pb-32 bg-gray-50 dark:bg-zinc-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 transition-colors duration-300">
        <div className="sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
          <button 
            onClick={() => setStep('services')}
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-800"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900 dark:text-zinc-100">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Escolha o Profissional</h2>
        </div>

        <div className="p-4 pt-6">
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">Com quem você gostaria de realizar o serviço?</p>
          
          {MOCK_PROVIDER.professionals.map(pro => (
             <ProfessionalCard 
               key={pro.id}
               professional={pro}
               isSelected={selectedProfessional?.id === pro.id}
               onSelect={setSelectedProfessional}
             />
          ))}
        </div>

        {selectedProfessional && (
           <SmartCart 
             cart={cart} 
             onContinue={() => setStep('calendar')} 
             onRemoveItem={toggleService}
             label="Ver Horários"
           />
        )}
      </div>
    );
  }

  if (step === 'calendar') {
    return (
      <div className="min-h-screen pb-32 bg-gray-50 dark:bg-zinc-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 transition-colors duration-300">
        <div className="sticky top-0 bg-gray-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
          <button 
            onClick={() => setStep('professional')}
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-800"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-900 dark:text-zinc-100">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Escolha o Horário</h2>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {['Hoje', 'Amanhã', 'Qua 29', 'Qui 30'].map((day, i) => (
                <button 
                  key={day}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    i === 0 
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-black' 
                      : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot.id}
                disabled={!slot.available}
                onClick={() => setSelectedSlot(slot)}
                className={`py-4 rounded-xl text-center font-medium transition-all ${
                  !slot.available 
                    ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-900/50 dark:text-zinc-600 cursor-not-allowed decoration-zinc-400 dark:decoration-zinc-600 line-through'
                    : selectedSlot?.id === slot.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-500/20 scale-105'
                      : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
          
          {/* Editable Summary Card */}
          <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
             {/* Services List Header */}
             <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Resumo do Pedido</span>
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{cart.length} itens</span>
             </div>

             {/* Services List */}
             <div className="p-4 space-y-4">
               {cart.map(item => (
                 <div key={item.id} className="flex justify-between items-start group">
                    <div className="flex-1 pr-4">
                       <div className="text-sm font-medium text-zinc-900 dark:text-zinc-200 leading-tight mb-0.5">{item.name}</div>
                       <div className="text-xs text-zinc-500 dark:text-zinc-400">{item.duration} min</div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">R$ {item.price}</span>
                       <button 
                         onClick={() => toggleService(item)}
                         className="text-zinc-400 hover:text-red-500 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                         aria-label="Remover item"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                       </button>
                    </div>
                 </div>
               ))}
             </div>
             
             {/* Divider */}
             <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-4"></div>

             {/* Info Footer */}
             <div className="p-4 bg-zinc-50/30 dark:bg-zinc-900/30">
                <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Profissional</span>
                    <span className="text-zinc-900 dark:text-zinc-300 font-medium">{selectedProfessional?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-3 text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400">Duração Total</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-200">{Math.floor(totalDuration/60)}h {totalDuration%60 > 0 ? `${totalDuration%60}m` : ''}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-zinc-900 dark:text-white pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                  <span>Total</span>
                  <span>R$ {cart.reduce((a,c) => a + c.price, 0)}</span>
                </div>
             </div>
          </div>
        </div>

        {selectedSlot && (
          <SmartCart 
            cart={cart} 
            onContinue={initiateBooking} 
            onRemoveItem={toggleService}
            label={`Agendar às ${selectedSlot.time}`}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-gray-50 dark:bg-zinc-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 transition-colors duration-300">
      
      {/* Theme Toggle */}
      <div className="absolute top-2 right-2 z-50">
        <button 
          onClick={toggleTheme}
          className="bg-black/10 dark:bg-white/10 backdrop-blur text-black/60 dark:text-white/60 p-2 rounded-full transition-all border border-black/5 dark:border-white/10 hover:bg-black/20 dark:hover:bg-white/20"
        >
          {isDarkMode ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          )}
        </button>
      </div>

      {/* Profile Header */}
      <div className="p-6 pb-2 flex flex-col items-center text-center relative z-10">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800 mb-4 shadow-2xl bg-white dark:bg-zinc-900">
          <img src={MOCK_PROVIDER.avatarUrl} alt={MOCK_PROVIDER.name} className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2 text-zinc-900 dark:text-white">
          {MOCK_PROVIDER.name}
          <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"/></svg>
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">@{MOCK_PROVIDER.handle} • {MOCK_PROVIDER.location}</p>
        
        <div className="flex gap-4 mb-6 w-full justify-center">
          <a 
            href="https://www.google.com/maps" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition text-zinc-700 dark:text-zinc-300 shadow-sm"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 dark:text-zinc-400">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Como chegar
          </a>
          <a 
            href="https://api.whatsapp.com/send" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition text-zinc-700 dark:text-zinc-300 shadow-sm"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Loyalty Card Section */}
      {MOCK_PROVIDER.loyaltyProgram && (
        <LoyaltyCard visits={visits} config={MOCK_PROVIDER.loyaltyProgram} />
      )}

      {/* Highlights Section (Combos Slideshow) */}
      {highlights.length > 0 && (
        <div className="mb-8 overflow-hidden">
           <div className="flex items-center gap-2 mb-3 px-6 animate-fade-in-up">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
               <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
             </svg>
             <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-wider">Destaques</h2>
           </div>
           
           {/* Horizontal Scroll Container */}
           <div 
             ref={scrollContainerRef}
             className="flex overflow-x-auto gap-4 px-6 pb-8 pt-2 no-scrollbar snap-x scroll-smooth transition-transform duration-700"
           >
             {highlights.map(service => (
               <HighlightCard 
                 key={service.id} 
                 service={service} 
                 isSelected={cart.some(s => s.id === service.id)}
                 onToggle={toggleService}
               />
             ))}
           </div>
        </div>
      )}

      {/* Services List categorized */}
      {categories.map(category => {
        const categoryServices = MOCK_PROVIDER.services.filter(s => s.category === category);
        if (categoryServices.length === 0) return null;
        
        return (
          <div key={category} className="px-4 mb-6">
            <h2 className="text-sm font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mb-3 pl-1">{category}</h2>
            {categoryServices.map(service => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                isSelected={cart.some(s => s.id === service.id)}
                onToggle={toggleService}
              />
            ))}
          </div>
        );
      })}

      <SmartCart 
        cart={cart} 
        onContinue={() => setStep('professional')} 
        onRemoveItem={toggleService}
      />
      <AIChat />
    </div>
  );
};