import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({label, className = '', ...props}) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>}
            <input
                className={`bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all placeholder-slate-500 ${className}`}
                {...props}
            />
        </div>
    );
};