import { useState, useCallback } from 'react';

export const useTabManager = (defaultTab: string = 'dashboard') => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  return {
    activeTab,
    setActiveTab,
    handleTabChange,
  };
}; 