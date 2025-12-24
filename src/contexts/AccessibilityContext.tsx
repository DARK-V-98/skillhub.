'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessibilitySettings } from '@/lib/types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  dyslexicFont: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNav: false,
  textToSpeech: false,
  colorBlindFilter: 'none',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('accessibility-settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.error("Failed to parse accessibility settings from localStorage", error);
      // Fallback to default settings
      setSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
      
      const root = document.documentElement;
      
      root.style.fontSize = `${settings.fontSize}px`;
      
      root.classList.toggle('high-contrast', settings.highContrast);
      
      root.classList.toggle('font-dyslexic', settings.dyslexicFont);

      root.classList.remove('filter-protanopia', 'filter-deuteranopia', 'filter-tritanopia');
      if (settings.colorBlindFilter !== 'none') {
        root.classList.add(`filter-${settings.colorBlindFilter}`);
      }
      
      root.setAttribute('data-reduced-motion', String(settings.reducedMotion));
    }
  }, [settings, isMounted]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  if (!isMounted) {
    // Return null on the server to avoid hydration mismatch
    return null;
  }

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
