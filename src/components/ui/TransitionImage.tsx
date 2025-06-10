import React, { useState, useEffect } from 'react'; // Added useEffect for potential future use
import { Loader2, ImageOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TransitionImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  lowResSrc?: string; // Not directly used in the current logic for optimization, but kept for interface consistency
}

const TransitionImage: React.FC<TransitionImageProps> = ({
  src,
  alt,
  className,
  wrapperClassName,
  lowResSrc, // Can be used for a separate low-res image if provided
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Determine if the source is from Pexels
  const isPexels = src?.includes('images.pexels.com');

  // Conditionally apply optimization parameters
  const finalSrc = isPexels
    ? `${src}?auto=compress&w=1000&q=80` // Apply Pexels specific optimization for main image
    : src; // Use original src for non-Pexels images

  // For thumbnail, if you want a separate low-res version for non-Pexels, use lowResSrc prop, otherwise use finalSrc
  const finalThumbnailSrc = isPexels
    ? `${src}?auto=compress&w=50&q=10&blur=10`
    : lowResSrc || src; // Use lowResSrc if provided, otherwise the original src

  // Reset loading/error states when src changes
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
  }, [src]);

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
      
      {isError ? ( // Render error state if isError is true
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <ImageOff className="w-8 h-8 mb-2" />
          <span className="text-sm">Failed to load image</span>
        </div>
      ) : (
        <>
          {/* Thumbnail image (optional, for progressive loading effect) */}
          <img
            src={finalThumbnailSrc}
            alt={alt}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-50" : "opacity-0" // Thumbnail is visible when loading, fades out when main image loads
            )}
            // Important: do not set onLoad/onError on thumbnail if main image handles loading
            // If you want a full blur-up effect, this thumbnail should load first
            // and main image should set its own onLoad/onError
          />

          {/* Main image */}
          <img
            src={finalSrc} // Use the correctly determined source
            alt={alt}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-500",
              isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100", // Main image fades in
              className // Apply external className prop
            )}
            onLoad={() => setIsLoading(false)} // Set loading false when main image loads
            onError={() => {
              setIsLoading(false); // Stop loading animation
              setIsError(true);    // Show error state
            }}
            {...props}
          />
        </>
      )}
    </div>
  );
};

export default TransitionImage;