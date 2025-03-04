
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Camera, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTryOn } from '../context/TryOnContext';
import { usePoseDetection, overlayShirt } from '../utils/poseDetection';
import { useToast } from "@/hooks/use-toast";

const VirtualTryOn: React.FC = () => {
  const { 
    isWebcamActive, 
    setWebcamActive, 
    currentShirtIndex, 
    setCurrentShirtIndex,
    availableShirts,
    isPoseDetectionSupported,
    errorMessage,
    resetCameraError
  } = useTryOn();
  
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const shirtImageRef = useRef<HTMLImageElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [useFallbackMode, setUseFallbackMode] = useState(false);
  
  const { canvasRef, poseData, isLoading, startDetection, stopDetection } = usePoseDetection(videoRef);
  
  // Load shirt image
  useEffect(() => {
    if (!availableShirts[currentShirtIndex]) return;
    
    const img = new Image();
    img.src = availableShirts[currentShirtIndex];
    img.onload = () => {
      shirtImageRef.current = img;
    };
  }, [currentShirtIndex, availableShirts]);
  
  // Handle webcam
  useEffect(() => {
    const startWebcam = async () => {
      if (!isWebcamActive) {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
        return;
      }
      
      // Reset any previous errors
      resetCameraError();
      
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          setStream(videoStream);
          
          // Wait for video to start playing
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(error => {
              console.error("Error playing video:", error);
              toast({
                title: "Camera Error",
                description: "There was a problem starting your camera stream. Please try again.",
                variant: "destructive",
              });
            });
            startDetection();
          };
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        
        // Show toast with error
        toast({
          title: "Camera Not Available",
          description: "Couldn't access your camera. Using demo mode instead.",
          variant: "destructive",
        });
        
        setUseFallbackMode(true);
        
        // If we can't access the camera, we'll use a fallback mode
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = 640;
            canvasRef.current.height = 480;
            
            // Draw a placeholder background
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            
            // Draw a silhouette
            ctx.fillStyle = '#d0d0d0';
            const centerX = canvasRef.current.width / 2;
            ctx.beginPath();
            ctx.ellipse(centerX, 120, 50, 60, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(centerX - 80, 200);
            ctx.lineTo(centerX + 80, 200);
            ctx.lineTo(centerX + 100, 400);
            ctx.lineTo(centerX - 100, 400);
            ctx.closePath();
            ctx.fill();
            
            // Overlay the current shirt
            if (shirtImageRef.current) {
              const shirtWidth = 200;
              const shirtHeight = shirtWidth * (shirtImageRef.current.height / shirtImageRef.current.width);
              ctx.drawImage(
                shirtImageRef.current,
                centerX - shirtWidth / 2,
                180,
                shirtWidth,
                shirtHeight
              );
            }
          }
        }
      }
    };
    
    startWebcam();
    
    return () => {
      stopDetection();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isWebcamActive, startDetection, stopDetection, toast, resetCameraError]);
  
  // Draw shirt on canvas in fallback mode
  useEffect(() => {
    if (useFallbackMode && canvasRef.current && shirtImageRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Draw silhouette
      ctx.fillStyle = '#d0d0d0';
      const centerX = canvasRef.current.width / 2;
      ctx.beginPath();
      ctx.ellipse(centerX, 120, 50, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(centerX - 80, 200);
      ctx.lineTo(centerX + 80, 200);
      ctx.lineTo(centerX + 100, 400);
      ctx.lineTo(centerX - 100, 400);
      ctx.closePath();
      ctx.fill();
      
      // Draw shirt
      const shirtWidth = 200;
      const shirtHeight = shirtWidth * (shirtImageRef.current.height / shirtImageRef.current.width);
      ctx.drawImage(
        shirtImageRef.current,
        centerX - shirtWidth / 2,
        180,
        shirtWidth,
        shirtHeight
      );
    }
  }, [useFallbackMode, currentShirtIndex]);
  
  // Draw shirt on canvas with pose detection
  useEffect(() => {
    if (!useFallbackMode && poseData && canvasRef.current && shirtImageRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      // Re-draw video frame
      if (videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      
      // Overlay shirt
      overlayShirt(canvasRef.current, poseData, shirtImageRef.current);
    }
  }, [poseData, useFallbackMode]);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  const changeShirt = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentShirtIndex((currentShirtIndex + 1) % availableShirts.length);
    } else {
      setCurrentShirtIndex((currentShirtIndex - 1 + availableShirts.length) % availableShirts.length);
    }
  };
  
  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'rounded-2xl overflow-hidden'}`}>
      {isFullscreen && (
        <button 
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-50 p-2 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Exit Fullscreen</span>
        </button>
      )}
      
      <div className={`relative ${isFullscreen ? 'h-screen' : 'aspect-video max-h-[70vh]'} bg-muted flex items-center justify-center overflow-hidden`}>
        {!isWebcamActive ? (
          <div className="text-center space-y-6 p-6 max-w-lg mx-auto">
            <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-medium">Virtual Try-On</h2>
            <p className="text-muted-foreground">
              Experience clothes virtually before you buy. Our AI will overlay selected items on your webcam feed in real-time.
            </p>
            
            {errorMessage && !isPoseDetectionSupported ? (
              <div className="bg-destructive/10 p-4 rounded-lg text-sm text-destructive">
                {errorMessage}
              </div>
            ) : (
              <button 
                onClick={() => setWebcamActive(true)}
                className="button-primary w-full"
              >
                Start Camera
              </button>
            )}
          </div>
        ) : (
          <>
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              style={{ display: 'none' }}
            />
            <canvas 
              ref={canvasRef}
              className="w-full h-full object-cover"
            />
            
            {isLoading && !useFallbackMode && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-rotation mx-auto"></div>
                  <p className="text-foreground">Initializing pose detection...</p>
                </div>
              </div>
            )}
            
            {/* Shirt navigation */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
              <button 
                onClick={() => changeShirt('prev')}
                className="p-3 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 hover:bg-background transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Previous Shirt</span>
              </button>
              
              <div className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 flex items-center">
                <span className="text-sm font-medium">
                  {currentShirtIndex + 1} / {availableShirts.length}
                </span>
              </div>
              
              <button 
                onClick={() => changeShirt('next')}
                className="p-3 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 hover:bg-background transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                <span className="sr-only">Next Shirt</span>
              </button>
            </div>
            
            {/* Controls */}
            <div className="absolute top-6 right-6 flex space-x-2">
              <button
                onClick={toggleFullscreen}
                className="p-3 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 hover:bg-background transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.33325 5.33336V1.33336H5.33325" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.6667 5.33336V1.33336H10.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.33325 10.6667V14.6667H5.33325" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.6667 10.6667V14.6667H10.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="sr-only">Toggle Fullscreen</span>
              </button>
              
              <button
                onClick={() => {
                  setWebcamActive(false);
                  setUseFallbackMode(false);
                }}
                className="p-3 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="sr-only">Stop Camera</span>
              </button>
            </div>
            
            {useFallbackMode && (
              <div className="absolute top-6 left-6 px-4 py-2 bg-amber-500/80 text-white rounded-full text-sm">
                Demo Mode (No Camera)
              </div>
            )}
          </>
        )}
      </div>
      
      {!isFullscreen && !isWebcamActive && (
        <div className="mt-8 grid grid-cols-5 gap-4">
          {availableShirts.map((shirt, index) => (
            <button
              key={index}
              onClick={() => setCurrentShirtIndex(index)}
              className={`relative aspect-square bg-muted rounded-lg overflow-hidden transition-all ${
                currentShirtIndex === index 
                  ? 'ring-2 ring-primary scale-105' 
                  : 'hover:ring-1 hover:ring-border hover:scale-105'
              }`}
            >
              <img 
                src={shirt} 
                alt={`Shirt ${index + 1}`} 
                className="object-contain w-full h-full p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;
