import React, { useEffect, useState } from 'react';

interface TriggerToastProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose?: () => void;
}

export default function TriggerToast({ 
  message, 
  type = 'success', 
  duration = 5000,
  onClose
}: TriggerToastProps) {
  const [visible, setVisible] = useState(true);
  
  // Format message to remove SUKSES: prefix
  const formattedMessage = message.replace('SUKSES:', '').trim();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  if (!visible) return null;
  
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className={`fixed bottom-20 right-4 ${bgColor} text-white px-4 py-3 rounded-md shadow-lg z-50 max-w-md`}>
      <div className="flex items-start space-x-2">
        <div className="mt-0.5">
          {type === 'success' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div className="flex-1">{formattedMessage}</div>
      </div>
    </div>
  );
}