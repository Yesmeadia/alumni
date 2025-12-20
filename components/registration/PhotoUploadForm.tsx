// app/components/registration/PhotoUploadForm.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoUploadFormProps {
  imageFile: File | null;
  imagePreview: string;
  onImageChange: (file: File | null, preview: string) => void;
}

const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({
  imageFile,
  imagePreview,
  onImageChange,
}) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file (PNG, JPG, JPEG)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onImageChange(null, '');
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Passport Size Photo</h3>
        <p className="text-gray-600 mb-6">
          Upload a recent passport-size photograph for identification purposes.
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {imagePreview ? (
                  <div className="relative w-full h-full p-4">
                    <div className="relative w-48 h-48 mx-auto">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-20 h-20 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="w-10 h-10 text-blue-600" />
                    </div>
                    <p className="mb-2 text-lg text-gray-700">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                    <p className="text-xs text-gray-500 mt-2">Passport size photo recommended</p>
                  </div>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {!imagePreview && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Photo
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="space-y-2">
          <h4 className="font-semibold text-blue-700">Photo Requirements:</h4>
          <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
            <li>Recent passport-size photograph</li>
            <li>Clear face visible (preferably with light background)</li>
            <li>Maximum file size: 5MB</li>
            <li>Accepted formats: PNG, JPG, JPEG</li>
            <li>No sunglasses or hats that obscure face</li>
          </ul>
        </div>
      </div>

      {imagePreview && (
        <div className="text-center">
          <p className="text-green-600 font-medium">
            ✓ Photo uploaded successfully!
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUploadForm;