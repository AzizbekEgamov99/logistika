'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

type RouteTransitionProps = {
  children: React.ReactNode;
};

export default function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set up handlers for route change events
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      // Use timeout to ensure smooth animation
      setTimeout(() => {
        setLoading(false);
      }, 100);
    };

    // Set up event listeners
    window.addEventListener('routeChangeStart', handleRouteChangeStart);
    window.addEventListener('routeChangeComplete', handleRouteChangeComplete);

    // Clean up event listeners
    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart);
      window.removeEventListener('routeChangeComplete', handleRouteChangeComplete);
    };
  }, []);

  return (
    <>
      {loading && (
        <div className="route-transition-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      <style jsx global>{`
        .route-transition-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #1890ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
} 