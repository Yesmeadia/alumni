import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { toast } from 'sonner';
import { validateImageMagicBytes } from '@/lib/security';

const ALLOWED_IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

interface PhotoUploadFormProps {
  imageFile: File | null;
  imagePreview: string;
  onImageChange: (file: File | null, preview: string) => void;
}

const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({
  imagePreview,
  onImageChange,
}) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      e.target.value = '';
      return;
    }

    if (!ALLOWED_IMAGE_MIMES.has(file.type)) {
      toast.error('Only PNG, JPG, JPEG, and WebP images are allowed');
      e.target.value = '';
      return;
    }

    const validBytes = await validateImageMagicBytes(file);
    if (!validBytes) {
      toast.error('Invalid image file. Please select a genuine PNG, JPG, or WebP photo.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(file, reader.result as string);
    };
    reader.readAsDataURL(file);
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
            className="flex flex-col items-center justify-center w-full min-h-[220px] sm:h-64 p-4 border-2 border-dashed border-gray-300 hover:border-[#2a1b63] rounded-2xl cursor-pointer bg-[#faf9f6] hover:bg-[#f7f4ed] transition-colors"
          >
            {imagePreview ? (
              <div className="relative p-2 sm:p-4">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto">
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
              <div className="flex flex-col items-center justify-center px-3 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mb-3 sm:mb-4 bg-[#2a1b63]/10 text-[#2a1b63] rounded-2xl flex items-center justify-center">
                  <Icon name="upload" className="text-[26px] sm:text-[28px]" />
                </div>
                <p className="mb-1 text-sm sm:text-base text-[#212529]">
                  <span className="font-semibold text-[#2a1b63]">Tap to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
              </div>
            )}
            <input
              id="photo-upload"
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
            />
          </label>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-[#2a1b63] text-[#2a1b63] hover:bg-[#2a1b63]/5 rounded-lg"
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            {imagePreview ? 'Change Photo' : 'Choose Photo'}
          </Button>
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
