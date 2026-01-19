import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ImageUploadButtonProps {
  onImageSelect: (imageData: string | null) => void;
  selectedImage: string | null;
  disabled?: boolean;
}

export const ImageUploadButton = ({
  onImageSelect,
  selectedImage,
  disabled = false,
}: ImageUploadButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    setIsLoading(true);

    try {
      // Compress and convert to base64
      const imageData = await compressAndConvertToBase64(file);
      onImageSelect(imageData);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsLoading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  const compressAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 1024px)
          let width = img.width;
          let height = img.height;
          const maxSize = 1024;
          
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with 0.8 quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = () => {
    onImageSelect(null);
  };

  const openGallery = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  if (selectedImage) {
    return (
      <div className="relative inline-block">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-primary/50">
          <img 
            src={selectedImage} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemoveImage}
            disabled={disabled}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/90 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled || isLoading}
            className="shrink-0 text-muted-foreground hover:text-primary"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={openCamera} className="gap-2">
            <Camera className="h-4 w-4" />
            Tirar foto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openGallery} className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Escolher da galeria
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
