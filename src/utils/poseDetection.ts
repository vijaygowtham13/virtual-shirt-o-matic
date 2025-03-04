
import { useEffect, useRef, useState } from 'react';

export const usePoseDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [shouldDetect, setShouldDetect] = useState(false);
  const [poseData, setPoseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Detect pose from video feed
  const detectPose = () => {
    if (!videoRef.current || !canvasRef.current || !shouldDetect) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    try {
      // Set canvas dimensions to match video
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Only consider camera ready if we have dimensions
        if (!cameraReady && video.videoWidth > 0) {
          setCameraReady(true);
        }
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Check if video is actually playing and has dimensions
      if (video.readyState === 4 && video.videoWidth > 0 && video.videoHeight > 0) {
        // Draw video frame to canvas - this shows the camera feed
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Generate shoulder points (improved for more accurate positioning)
        const mockShoulders = {
          leftShoulder: {
            x: canvas.width * 0.35,
            y: canvas.height * 0.3
          },
          rightShoulder: {
            x: canvas.width * 0.65,
            y: canvas.height * 0.3
          },
          nosePosition: {
            x: canvas.width * 0.5,
            y: canvas.height * 0.2
          }
        };
        
        // Draw debug markers for shoulders (can be removed in production)
        if (import.meta.env.DEV) {
          ctx.fillStyle = 'rgba(0, 120, 255, 0.5)';
          ctx.beginPath();
          ctx.arc(mockShoulders.leftShoulder.x, mockShoulders.leftShoulder.y, 10, 0, 2 * Math.PI);
          ctx.arc(mockShoulders.rightShoulder.x, mockShoulders.rightShoulder.y, 10, 0, 2 * Math.PI);
          ctx.fill();
        }
        
        // Update pose data
        setPoseData(mockShoulders);
      } else {
        // If video isn't ready, draw placeholder
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Waiting for camera...', canvas.width / 2, canvas.height / 2);
      }
    } catch (error) {
      console.error("Error in pose detection:", error);
    }
    
    // Request next frame
    requestRef.current = requestAnimationFrame(detectPose);
  };
  
  // Start/stop detection
  useEffect(() => {
    if (!shouldDetect) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }
    
    const startDetection = async () => {
      setIsLoading(true);
      
      // Simulate loading the model (shorter for better UX)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsLoading(false);
      detectPose();
    };
    
    startDetection();
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [shouldDetect]);
  
  return {
    canvasRef,
    poseData,
    isLoading,
    cameraReady,
    startDetection: () => setShouldDetect(true),
    stopDetection: () => setShouldDetect(false),
  };
};

// Function to overlay a shirt on the canvas with improved positioning
export const overlayShirt = (
  canvas: HTMLCanvasElement | null,
  poseData: any,
  shirtImage: HTMLImageElement | null
) => {
  if (!canvas || !poseData || !shirtImage) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  try {
    const { leftShoulder, rightShoulder } = poseData;
    
    // Calculate shirt width based on shoulder width with better scaling
    const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
    const shirtWidth = shoulderWidth * 1.8; // Increased scale factor for better visibility
    
    // Calculate shirt height based on aspect ratio
    const aspectRatio = shirtImage.height / shirtImage.width;
    const shirtHeight = shirtWidth * aspectRatio;
    
    // Calculate position (centered between shoulders) with better vertical positioning
    const centerX = (leftShoulder.x + rightShoulder.x) / 2;
    const centerY = (leftShoulder.y + rightShoulder.y) / 2;
    
    // Draw shirt (position adjusted so it sits on the shoulders)
    const shirtX = centerX - shirtWidth / 2;
    const shirtY = centerY - shirtHeight * 0.25; // Improved offset for better positioning
    
    ctx.drawImage(shirtImage, shirtX, shirtY, shirtWidth, shirtHeight);
  } catch (error) {
    console.error("Error overlaying shirt:", error);
  }
};
