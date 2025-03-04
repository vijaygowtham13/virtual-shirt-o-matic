
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface TryOnContextType {
  isWebcamActive: boolean;
  setWebcamActive: (active: boolean) => void;
  currentShirtIndex: number;
  setCurrentShirtIndex: (index: number) => void;
  availableShirts: string[];
  isLoading: boolean;
  isPoseDetectionSupported: boolean;
  errorMessage: string | null;
  resetCameraError: () => void;
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
  const { toast } = useToast();
  
  // In a real app, these would be loaded from an API
  const [availableShirts] = useState([
    "/shirts/shirt1.png",
    "/shirts/shirt2.png",
    "/shirts/shirt3.png",
    "/shirts/shirt4.png",
    "/shirts/shirt5.png",
  ]);

  const resetCameraError = () => {
    setErrorMessage(null);
    setIsPoseDetectionSupported(true);
  };

  // Check browser support for webcam
  useEffect(() => {
    const checkMediaDevices = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setIsPoseDetectionSupported(false);
          setErrorMessage("Your browser doesn't support webcam access.");
          
          toast({
            title: "Camera Not Supported",
            description: "Your browser doesn't support webcam access.",
            variant: "destructive",
          });
          return;
        }
        
        // Here we're just checking if the browser supports getUserMedia
        // We'll handle actual camera permissions in the VirtualTryOn component
        setIsPoseDetectionSupported(true);
        setErrorMessage(null);
      } catch (error) {
        console.error("Camera access error:", error);
        setIsPoseDetectionSupported(false);
        
        const errorMessage = "Unable to access camera. Please ensure you have a webcam connected and allow camera permissions.";
        setErrorMessage(errorMessage);
        
        toast({
          title: "Camera Access Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    checkMediaDevices();
  }, [toast]);

  const value = {
    isWebcamActive,
    setWebcamActive,
    currentShirtIndex,
    setCurrentShirtIndex,
    availableShirts,
    isLoading,
    isPoseDetectionSupported,
    errorMessage,
    resetCameraError
  };

  return <TryOnContext.Provider value={value}>{children}</TryOnContext.Provider>;
};
