'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from './ui/button';
import { Camera, RefreshCcw, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from '@/firebase/config';
import { useUser } from '@/firebase/auth/use-user';
import { v4 as uuidv4 } from 'uuid';


interface CameraCaptureProps {
  onCapture: (url: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        variant: 'destructive',
        title: 'Camera Error',
        description: 'Could not access your camera. Please check permissions.',
      });
    }
  }, [toast]);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [startCamera, stream]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
      stream?.getTracks().forEach(track => track.stop());
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleUsePicture = async () => {
    if (!capturedImage || !user) return;
    setIsUploading(true);
    
    try {
      const storage = getStorage(app);
      const fileName = `${user.uid}-${uuidv4()}.jpg`;
      const storageRef = ref(storage, `profile-pictures/${fileName}`);

      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      onCapture(downloadURL);
      toast({
        title: 'Success!',
        description: 'Profile picture updated.',
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: 'Failed to upload your new picture. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-secondary rounded-lg overflow-hidden">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="flex justify-center gap-4">
        {capturedImage ? (
          <>
            <Button variant="outline" onClick={handleRetake} disabled={isUploading}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Retake
            </Button>
            <Button onClick={handleUsePicture} disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              {isUploading ? 'Uploading...' : 'Use Picture'}
            </Button>
          </>
        ) : (
          <Button onClick={handleCapture} className="w-16 h-16 rounded-full">
            <Camera className="h-8 w-8" />
            <span className="sr-only">Take Picture</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
