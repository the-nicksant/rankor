import React from 'react';
import Logo from '../assets/rankor-red.png'

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  title?: string;
  description?: string;
  iconSize?: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
  title,
  description,
  iconSize = 60,
}) => {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-background bg-opacity-50 flex flex-col justify-center items-center z-20">
          <div
            className="border-t-transparent rounded-full animate-spin aspect-square"
            style={{ width: iconSize, height: iconSize }}
          >
            <img src={Logo} alt='rankor' className='w-full'/>
          </div>
          {title && <h2 className="text-white text-lg mt-4">{title}</h2>}
          {description && <p className="text-muted-foreground text-sm mt-2">{description}</p>}
        </div>
      )}
    </div>
  );
};
