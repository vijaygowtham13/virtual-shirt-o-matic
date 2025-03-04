
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface TryOnContextType {
  isWebcamActive: boolean;
  setWebcamActive: (active: boolean) => void;
  currentShirtIndex: number;
  setCurrentShirtIndex: (index: number) => void;
  availableShirts: string[];
  isLoading: boolean;
  isPoseDetectionSupported: boolean;
  errorMessage: string | null;
}

const TryOnContext = createContext<TryOnContextType | undefined>(undefined);

export const useTryOn = () => {
  const context = useContext(TryOnContext);
  if (context === undefined) {
    throw new Error('useTryOn must be used within a TryOnProvider');
  }
  return context;
};

interface TryOnProviderProps {
  children: ReactNode;
}

export const TryOnProvider: React.FC<TryOnProviderProps> = ({ children }) => {
  const [isWebcamActive, setWebcamActive] = useState(false);
  const [currentShirtIndex, setCurrentShirtIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPoseDetectionSupported, setIsPoseDetectionSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // In a real app, these would be loaded from an API
  const [availableShirts] = useState([
    "/shirts/shirt1.png",
    "/shirts/shirt2.png",
    "/shirts/shirt3.png",
    "/shirts/shirt4.png",
    "/shirts/shirt5.png",
  ]);

  // Check browser support for webcam
  useEffect(() => {
    const checkMediaDevices = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setIsPoseDetectionSupported(false);
          setErrorMessage("Your browser doesn't support webcam access.");
          return;
        }
        
        // Test if we can access the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Clean up the test stream
        stream.getTracks().forEach(track => track.stop());
        
        setIsPoseDetectionSupported(true);
        setErrorMessage(null);
      } catch (error) {
        console.error("Camera access error:", error);
        setIsPoseDetectionSupported(false);
        setErrorMessage("Unable to access camera. Please allow camera permissions.");
      }
    };

    checkMediaDevices();
  }, []);

  const value = {
    isWebcamActive,
    setWebcamActive,
    currentShirtIndex,
    setCurrentShirtIndex,
    availableShirts,
    isLoading,
    isPoseDetectionSupported,
    errorMessage
  };

  return <TryOnContext.Provider value={value}>{children}</TryOnContext.Provider>;
};
