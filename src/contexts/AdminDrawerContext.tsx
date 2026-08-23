import React, { createContext, useContext, useState, useCallback } from 'react';

interface AdminDrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const AdminDrawerContext = createContext<AdminDrawerContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export function AdminDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <AdminDrawerContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </AdminDrawerContext.Provider>
  );
}

export function useAdminDrawer() {
  return useContext(AdminDrawerContext);
}
