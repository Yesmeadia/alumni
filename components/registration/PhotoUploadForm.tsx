import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { toast } from 'sonner';

interface PhotoUploadFormProps {
  imageFile: File | null;
  imagePreview: string;
  onImageChange: (file: File | null, preview: string) => void;
}

const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({
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
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-xl font-bold text-[#2a1b63] mb-1.5">
          Passport Size Photo
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Upload a recent passport-size photograph for your official alumni ID card.
        </p>

        <div className="max-w-xl mx-auto space-y-4">
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 hover:border-[#2a1b63] rounded-2xl cursor-pointer bg-[#faf9f6] hover:bg-[#f7f4ed] transition-colors"
          >
            {imagePreview ? (
              <div className="relative p-4">
                <div className="relative w-44 h-44 mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl border-2 border-[#a5874c]"
                  />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow"
                  >
                    <Icon name="close" className="text-[16px]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <div className="w-14 h-14 mb-4 bg-[#2a1b63]/10 text-[#2a1b63] rounded-2xl flex items-center justify-center">
                  <Icon name="upload" className="text-[28px]" />
                </div>
                <p className="mb-1 text-base text-[#212529]">
                  <span className="font-semibold text-[#2a1b63]">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
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

          {!imagePreview && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#2a1b63] text-[#2a1b63] hover:bg-[#2a1b63]/5 rounded-lg"
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              Choose Photo
            </Button>
          )}
        </div>
      </div>

      <div className="bg-[#f7f4ed] p-5 rounded-xl border-l-4 border-[#a5874c]">
        <h4 className="font-display text-sm font-bold text-[#2a1b63] mb-2">Photo Requirements</h4>
        <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
          <li>Recent passport-size photograph</li>
          <li>Clear face visible (preferably with a light background)</li>
          <li>Maximum file size: 5MB (PNG, JPG, JPEG)</li>
          <li>No sunglasses or hats that obscure your face</li>
        </ul>
      </div>

      {imagePreview && (
        <p className="text-center text-sm font-semibold text-emerald-700">
          Photo uploaded successfully.
        </p>
      )}
    </div>
  );
};

export default PhotoUploadForm;
