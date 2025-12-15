"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'error' | 'success';
}

export default function Toast({ message, isVisible, onClose, type = 'error' }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000); // 3 saniye sonra kaybolur
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 20 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div className={`
            px-6 py-3 rounded-full shadow-xl flex items-center gap-3 pointer-events-auto
            ${type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}
          `}>
            <span>{type === 'error' ? '⚠️' : '✅'}</span>
            <span className="font-bold text-sm">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}