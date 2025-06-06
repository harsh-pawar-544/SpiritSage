import React, { useState } from 'react';
import { Loader2, ImageOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TransitionImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  lowResSrc?: string;
}

const TransitionImage: React.FC<TransitionImageProps> = ({
  src,
  alt,
  className,
  wrapperClassName,
  lowResSrc,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const thumbnailSrc = src?.includes('images.pexels.com')
    ? `${src}?auto=compress&w=50&q=10&blur=10`
    : src;
    
  const optimizedSrc = src?.includes('images.pexels.com')
    ? `${src}?auto=compress&w=1000&q=80`
    : src;

  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-800",
      wrapperClassName
    )}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-400 dark:text-gray-600 animate-spin" />
        </div>
      )}
      
      {!isError && (
        <>
          <img
            src={thumbnailSrc}
            alt={alt}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-50" : "opacity-0"
            )}
          />

          <img
            src={optimizedSrc}
            alt={alt}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-500",
              isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100",
              className
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setIsError(true);
            }}
            {...props}
          />
        </>
      )}

      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <ImageOff className="w-8 h-8 mb-2" />
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default TransitionImage;