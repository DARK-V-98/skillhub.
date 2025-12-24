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
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to parse accessibility settings from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
      
      const root = document.documentElement;
      
      root.style.setProperty('--font-size-base', `${settings.fontSize}px`);
      
      if (settings.highContrast) {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }
      
      if (settings.dyslexicFont) {
        root.classList.add('font-dyslexic');
      } else {
        root.classList.remove('font-dyslexic');
      }

      root.classList.remove('filter-protanopia', 'filter-deuteranopia', 'filter-tritanopia');
      if (settings.colorBlindFilter !== 'none') {
        root.classList.add(`filter-${settings.colorBlindFilter}`);
      }
      
      if (settings.reducedMotion) {
        root.setAttribute('data-reduced-motion', 'true');
      } else {
        root.removeAttribute('data-reduced-motion');
      }
    }
  }, [settings, isMounted]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };
  
  if (!isMounted) {
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
