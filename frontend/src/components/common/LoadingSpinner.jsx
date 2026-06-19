import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px]">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
      <p className="text-slate-500 dark:text-slate-400 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
