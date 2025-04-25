'use client';

import { useState, useEffect } from 'react';
import { getPerformanceMetrics, resetPerformanceMetrics } from '@/app/lib/performance';

/**
 * Performance Monitor component
 * Displays performance metrics
 */
export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageRequestTime: 0,
    successRate: 0
  });
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);  

  useEffect(() => {
    // Mark component as mounted
    setMounted(true);
    
    // Update metrics every 2 seconds
    const interval = setInterval(() => {
      setMetrics(getPerformanceMetrics());        
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Don't render until after mount to avoid SSR issues
  if (!mounted) {
    return null;
  }
  
  const handleReset = () => {
    resetPerformanceMetrics();
    setMetrics(getPerformanceMetrics());    
  };
  
  if (!visible) {
    return (
      <div 
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#FF5722',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          zIndex: 10000,
        }}
      >
        📊 Show Metrics
      </div>
    );
  }
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#1E293B',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 10000,
      width: '320px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Performance Metrics</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleReset} 
            style={{
              backgroundColor: '#EF4444',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
          <button 
            onClick={() => setVisible(false)} 
            style={{
              backgroundColor: '#4B5563',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Hide
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Requests:</span>
          <span>{metrics.totalRequests}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Successful:</span>
          <span style={{ color: '#4ADE80' }}>{metrics.successfulRequests}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Failed:</span>
          <span style={{ color: '#F87171' }}>{metrics.failedRequests}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Success Rate:</span>
          <span>{metrics.successRate.toFixed(1)}%</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Avg. Response Time:</span>
          <span>{metrics.averageRequestTime.toFixed(1)} ms</span>
        </div>
      </div>
    </div>
  );
} 