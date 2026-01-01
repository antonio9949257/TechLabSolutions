import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({ onFileSelect, existingImageUrl, fieldName }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (existingImageUrl) {
      setPreview(existingImageUrl);
      setFileName('Imagen actual');
    }
  }, [existingImageUrl]);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setFileName(file.name);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const handleRemoveImage = (e) => {
    e.stopPropagation(); // prevent opening file dialog
    setPreview(null);
    setFileName('');
    onFileSelect(null);
    // Clean up the object URL to avoid memory leaks
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-blue-50' : 'border-secondary hover:border-primary'}
          dark:border-gray-600 dark:hover:border-primary-dark ${isDragActive ? 'dark:bg-gray-800' : ''}`}
      >
        <input {...getInputProps()} id={fieldName} />
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="Vista previa" className="mx-auto h-40 rounded-lg object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-white bg-red-500 hover:bg-red-600 rounded-full p-2 text-sm"
              >
                Cambiar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-secondary">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="font-semibold">Arrastra y suelta una imagen aquí, o haz clic para seleccionar</p>
            <p className="text-xs mt-1">PNG, JPG, GIF, etc.</p>
          </div>
        )}
      </div>
      {fileName && (
        <div className="mt-2 text-sm text-secondary">
          <p>Archivo: {fileName}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
