import React, { useState, useEffect } from 'react';
import { AppMode } from './types';
import { ClientView } from './components/ClientView';
import { AdminView } from './components/AdminView';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CLIENT);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to Light Mode

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div 
      key={`${mode}-${isDarkMode ? 'dark' : 'light'}`}
      className={`max-w-md mx-auto min-h-screen shadow-2xl relative overflow-hidden animate-fade-in ${isDarkMode ? 'bg-zinc-950' : 'bg-gray-50'}`}
    >
      {/* Mode Switcher for Demo Purposes */}
      <div className="absolute top-2 right-14 z-50">
        <button 
          onClick={() => setMode(mode === AppMode.CLIENT ? AppMode.ADMIN : AppMode.CLIENT)}
          className="bg-black/10 dark:bg-white/10 backdrop-blur text-black/40 dark:text-white/40 hover:text-black hover:dark:text-white p-1.5 rounded-lg text-[10px] font-mono transition-all uppercase border border-black/5 dark:border-white/10"
        >
          {mode === AppMode.CLIENT ? 'Ver Admin' : 'Ver Cliente'}
        </button>
      </div>

      {mode === AppMode.CLIENT ? (
        <ClientView isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      ) : (
        <AdminView />
      )}
    </div>
  );
};

export default App;