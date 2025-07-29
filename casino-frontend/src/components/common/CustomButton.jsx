// src/components/CustomButton.jsx
import React from 'react';
import { motion } from 'framer-motion';

export function CustomButton({ children, className = '', onClick, variant = 'default' }) {
  const base = 'px-6 py-3 rounded-2xl font-semibold shadow-md transition-colors duration-300';
  const variants = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 text-black',
    green: 'bg-green-500 hover:bg-green-600 text-black',
    destructive: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
