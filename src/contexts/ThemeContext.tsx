import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    return saved || 'dark';
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    if (theme === 'light') {
      html.classList.remove('dark');
      html.classList.add('light');
      html.setAttribute('data-theme', 'light');
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#1a1a1a';
      body.classList.remove('bg-black');
      body.classList.add('bg-white');
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      body.style.backgroundColor = '#0f0f0f';
      body.style.color = '#ffffff';
      body.classList.remove('bg-white');
      body.classList.add('bg-black');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
