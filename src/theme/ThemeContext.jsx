import { createContext, useContext, useState, useEffect } from 'react';
import { getTokens, calmPos as _calmPos, calmPosBg as _calmPosBg } from './tokens';
import { createT } from '../i18n';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  const [lang, setLang] = useState('en');
  const T = getTokens(mode);
  const t = createT(lang);

  // Apply RTL direction whenever language changes
  useEffect(() => {
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    mode, setMode,
    lang, setLang,
    t,
    T,
    calmPos:   (n) => _calmPos(n, T),
    calmPosBg: (n) => _calmPosBg(n, T),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
