import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'outline';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  className = '',
                                                  isLoading,
                                                  disabled,
                                                  ...props
                                              }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg";

    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 shadow-indigo-500/20",
        danger: "bg-red-600 hover:bg-red-500 text-white border border-red-400 shadow-red-500/20",
        outline: "bg-transparent border-2 border-slate-600 hover:border-slate-400 text-slate-300"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
            ) : children}
        </button>
    );
};