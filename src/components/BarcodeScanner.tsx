import { useState, useRef, useEffect, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Button } from '@/components/ui/button';
import { Camera, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const { toast } = useToast();

  const startScanning = useCallback(async (deviceId: string) => {
    if (!videoRef.current || !readerRef.current) return;
    
    setIsScanning(true);
    try {
      await readerRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            const barcode = result.getText();
            onScan(barcode);
            stopScanning();
            onClose();
          }
        }
      );
    } catch (error) {
      console.error('Error starting scanner:', error);
      toast({
        title: 'Scanner Error',
        description: 'Failed to start camera. Please try again.',
        variant: 'destructive',
      });
      setIsScanning(false);
    }
  }, [onScan, onClose, toast]);

  const stopScanning = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    
    // Get available cameras
    readerRef.current.listVideoInputDevices().then((videoDevices) => {
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        // Prefer back camera
        const backCamera = videoDevices.find(d => 
          d.label.toLowerCase().includes('back') || 
          d.label.toLowerCase().includes('rear')
        );
        const deviceId = backCamera?.deviceId || videoDevices[0].deviceId;
        setSelectedDevice(deviceId);
        startScanning(deviceId);
      }
    }).catch((error) => {
      console.error('Error listing devices:', error);
      toast({
        title: 'Camera Access Denied',
        description: 'Please allow camera access to scan barcodes.',
        variant: 'destructive',
      });
    });

    return () => {
      stopScanning();
    };
  }, [startScanning, stopScanning, toast]);

  const switchCamera = () => {
    const currentIndex = devices.findIndex(d => d.deviceId === selectedDevice);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex].deviceId;
    setSelectedDevice(nextDevice);
    stopScanning();
    setTimeout(() => startScanning(nextDevice), 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-lg border border-border bg-card p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold">
            <Camera className="h-5 w-5" />
            Scan Barcode
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            playsInline
          />
          {/* Scanning overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-64 rounded border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" />
          </div>
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <p className="text-muted-foreground">Starting camera...</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          {devices.length > 1 && (
            <Button variant="outline" onClick={switchCamera} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Switch Camera
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          Position the barcode within the frame to scan
        </p>
      </div>
    </div>
  );
};

export default BarcodeScanner;
