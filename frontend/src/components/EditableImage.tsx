import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useEditMode } from './EditModeProvider';
import { ExternalBlob } from '../backend';

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  onImageChange?: (blob: ExternalBlob) => void;
}

export function EditableImage({ src, alt, className = '', onImageChange }: EditableImageProps) {
  const { isEditMode } = useEditMode();
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Create ExternalBlob with upload progress tracking
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      // Create local preview URL
      const objectUrl = URL.createObjectURL(file);
      setCurrentSrc(objectUrl);

      // Notify parent component with the ExternalBlob
      if (onImageChange) {
        onImageChange(blob);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group">
      <img src={currentSrc} alt={alt} className={className} />
      {isEditMode && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={handleButtonClick}
            disabled={isUploading}
            variant="secondary"
            size="sm"
            className="shadow-lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Change Image
              </>
            )}
          </Button>
          {isUploading && uploadProgress > 0 && (
            <div className="w-32 bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
