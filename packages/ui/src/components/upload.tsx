
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { toast } from 'sonner';

interface UploadInputProps {
  className?: string; 
  iconName: IconName;
  iconSize?: number;
  title: string;
  titleSize?: string;
  description: string; 
  multiple?: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  onFilesChange: (files: File[]) => void;
}

const UploadInput: React.FC<UploadInputProps> = ({
  className,
  iconName,
  iconSize = 24,
  title,
  titleSize = 'text-base',
  description,
  multiple = false,
  maxFiles = 1,
  acceptedFileTypes,
  onFilesChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFiles = useCallback(
    (files: FileList | File[]) => {
      let filesArray = Array.from(files);

      if (acceptedFileTypes && acceptedFileTypes.length > 0) {
        filesArray = filesArray.filter(file => {
          const mimeTypeMatch = acceptedFileTypes.includes(file.type);
          const extension = '.' + file.name.split('.').pop()?.toLowerCase();
          const extensionMatch = acceptedFileTypes.includes(extension);

          return mimeTypeMatch || extensionMatch;
        });
        if (filesArray.length === 0 && files.length > 0) {
          toast(`Nenhum arquivo aceito. Tipos permitidos: ${acceptedFileTypes.join(', ')}`);
          return;
        }
      }

      const currentMaxFiles = multiple ? maxFiles : 1;
      if (filesArray.length > currentMaxFiles) {
        toast(`Você pode carregar no máximo ${currentMaxFiles} arquivo(s).`);
        filesArray = filesArray.slice(0, currentMaxFiles);
      }

      onFilesChange(filesArray);
    },
    [acceptedFileTypes, multiple, maxFiles, onFilesChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndProcessFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
      }
    },
    [validateAndProcessFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        validateAndProcessFiles(e.target.files);
      }

      e.target.value = '';
    },
    [validateAndProcessFiles]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const acceptString = useMemo(() => {
    return acceptedFileTypes?.join(',') || '';
  }, [acceptedFileTypes]);

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer
        transition-all duration-200 ease-in-out
        ${className || 'bg-card border-2 border-dashed border-border text-foreground'}
        ${isDragging ? 'border-rankor' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
    
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept={acceptString}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center text-center space-y-2">
        {(
          <DynamicIcon name={iconName} size={iconSize} className="mb-2" />
        )}
        <h3 className={`${titleSize} font-semibold`}>{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {isDragging && (
        <div className="absolute inset-0 bg-blue-100 opacity-50 rounded-lg pointer-events-none"></div>
      )}
    </div>
  );
};

export default UploadInput;