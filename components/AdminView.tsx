import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { MOCK_PROVIDER } from '../constants';
import { Professional, Booking } from '../types';

// --- MOCK DATA GENERATOR ---
// Generates realistic bookings linked to professionals for the current week
const generateMockBookings = (): Booking[] => {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
  const bookings: Booking[] = [];
  const professionals = MOCK_PROVIDER.professionals;

  // Generate ~150 bookings
  for (let i = 0; i < 150; i++) {
    const pro = professionals[Math.floor(Math.random() * professionals.length)];
    const day = days[Math.floor(Math.random() * days.length)];
    // Random price between 30 and 150
    const price = Math.floor(Math.random() * (150 - 30 + 1) + 30);
    
    bookings.push({
      id: `bk-${i}`,
      professionalId: pro.id,
      serviceName: price > 80 ? 'Combo Completo' : 'Corte/Barba',
      price: price,
      date: day,
      timestamp: Date.now() - Math.floor(Math.random() * 604800000) // Random time in last week
    });
  }
  return bookings;
};

const ALL_BOOKINGS = generateMockBookings();

export const AdminView: React.FC = () => {
  // 'admin' = Owner view, otherwise professional ID
  const [currentRole, setCurrentRole] = useState<string>('admin');

  // --- DERIVED DATA ---
  
  // Filter bookings based on role
  const filteredBookings = useMemo(() => {
    if (currentRole === 'admin') return ALL_BOOKINGS;
    return ALL_BOOKINGS.filter(b => b.professionalId === currentRole);
  }, [currentRole]);

  // KPIs
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.price, 0);
  const totalAppts = filteredBookings.length;
  const avgTicket = totalAppts > 0 ? totalRevenue / totalAppts : 0;
  
  // Commission Logic (50% split for example)
  const COMMISSION_RATE = 0.5; 
  const totalCommission = totalRevenue * COMMISSION_RATE;

  // Chart Data: Revenue per Day
  const chartData = useMemo(() => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
    return days.map(day => {
      const dayBookings = filteredBookings.filter(b => b.date === day);
      return {
        name: day,
        revenue: dayBookings.reduce((sum, b) => sum + b.price, 0),
        count: dayBookings.length
      };
    });
  }, [filteredBookings]);

  // Admin Only: Top Professionals
  const teamPerformance = useMemo(() => {
    if (currentRole !== 'admin') return [];
    return MOCK_PROVIDER.professionals.map(pro => {
      const proBookings = ALL_BOOKINGS.filter(b => b.professionalId === pro.id);
      const rev = proBookings.reduce((sum, b) => sum + b.price, 0);
      return { ...pro, revenue: rev, count: proBookings.length };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [currentRole]);

  // Current User Display Info
  const currentUserProfile = currentRole === 'admin' 
    ? { name: 'Dono / Gerente', avatarUrl: MOCK_PROVIDER.avatarUrl, role: 'Administrador' }
    : MOCK_PROVIDER.professionals.find(p => p.id === currentRole);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 transition-colors duration-300">
      
      {/* Header & Role Switcher */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
             <div>
                <h1 className="text-xl font-bold tracking-tight">Painel de Controle</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Visão Semanal • {new Date().toLocaleDateString('pt-BR')}</p>
             </div>
             
             {/* Role Simulator Dropdown */}
             <select 
               value={currentRole}
               onChange={(e) => setCurrentRole(e.target.value)}
               className="bg-zinc-100 dark:bg-zinc-800 border-none text-xs font-medium rounded-lg px-3 py-2 text-zinc-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-red-500"
             >
               <option value="admin">Visão: Dono (Geral)</option>
               {MOCK_PROVIDER.professionals.map(pro => (
                 <option key={pro.id} value={pro.id}>Visão: {pro.name}</option>
               ))}
             </select>
          </div>

          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
             <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
               <img src={currentUserProfile?.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
             </div>
             <div>
               <p className="font-bold text-sm leading-none mb-1">{currentUserProfile?.name}</p>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] uppercase tracking-wider font-bold bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                   {currentUserProfile?.role}
                 </span>
                 {currentRole !== 'admin' && (
                    <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
                       Comissão: {COMMISSION_RATE * 100}%
                    </span>
                 )}
               </div>
             </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-6 animate-fade-in-up">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Main Revenue Card */}
          <div className="col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-900 dark:to-black p-5 rounded-2xl shadow-xl border border-zinc-700 relative overflow-hidden text-white">
             <div className="relative z-10">
               <p className="text-zinc-400 text-sm font-medium mb-1">
                 {currentRole === 'admin' ? 'Faturamento Total' : 'Sua Produção'}
               </p>
               <h2 className="text-4xl font-bold tracking-tight mb-2">
                 R$ {totalRevenue.toLocaleString('pt-BR')}
               </h2>
               <div className="flex gap-4 text-xs text-zinc-400">
                 <span className="flex items-center gap-1 text-green-400">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                   +12% vs semana passada
                 </span>
               </div>
             </div>
             {/* Decor */}
             <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          </div>

          {/* Secondary KPIs */}
          {currentRole !== 'admin' ? (
             <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wide mb-1">Sua Comissão</p>
               <p className="text-xl font-bold text-green-600 dark:text-green-500">R$ {totalCommission.toLocaleString('pt-BR')}</p>
               <p className="text-[10px] text-zinc-400 mt-1">Disponível para saque</p>
             </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
               <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wide mb-1">Ticket Médio</p>
               <p className="text-xl font-bold text-zinc-900 dark:text-white">R$ {avgTicket.toFixed(0)}</p>
               <p className="text-[10px] text-zinc-400 mt-1">Por agendamento</p>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wide mb-1">Agendamentos</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">{totalAppts}</p>
            <p className="text-[10px] text-zinc-400 mt-1">Nesta semana</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-72">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              {currentRole === 'admin' ? 'Desempenho da Loja' : 'Seu Desempenho'}
            </h3>
            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-500">Últimos 7 dias</span>
          </div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  borderColor: '#27272a', 
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                formatter={(value: number) => [`R$ ${value}`, 'Receita']}
              />
              <Bar dataKey="revenue" radius={[4, 4, 4, 4]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 5 || index === 6 ? '#ef4444' : '#3f3f46'} // Highlight weekend
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Team Performance List (Admin Only) */}
        {currentRole === 'admin' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white px-1">Top Profissionais</h3>
            <div className="space-y-3">
              {teamPerformance.map((pro, idx) => (
                <div key={pro.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                        <img src={pro.avatarUrl} alt={pro.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-zinc-900">
                        {idx + 1}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{pro.name}</p>
                      <p className="text-xs text-zinc-500">{pro.count} atendimentos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white block">R$ {pro.revenue}</span>
                    <span className="text-[10px] text-green-600 dark:text-green-500 font-medium">
                      {(pro.revenue / totalRevenue * 100).toFixed(0)}% do total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Bookings (Staff Only) */}
        {currentRole !== 'admin' && (
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-zinc-900 dark:text-white px-1">Histórico Recente</h3>
             <div className="space-y-3">
                {filteredBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 dark:text-zinc-400">
                         {booking.date}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">{booking.serviceName}</p>
                        <p className="text-[10px] text-zinc-500">Finalizado</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-bold text-zinc-900 dark:text-white block">R$ {booking.price}</span>
                       <span className="text-[10px] text-green-600 dark:text-green-500">
                         +R$ {booking.price * COMMISSION_RATE} (Com.)
                       </span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};