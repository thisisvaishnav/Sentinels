import React, { createContext, useContext, useState, useCallback } from 'react';

interface CitizenDrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CitizenDrawerContext = createContext<CitizenDrawerContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export function CitizenDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <CitizenDrawerContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </CitizenDrawerContext.Provider>
  );
}

export function useCitizenDrawer() {
  return useContext(CitizenDrawerContext);
}
