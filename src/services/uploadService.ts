import { API_BASE_URL } from "@/config/env";

export interface UploadSingleResponse {
  success: boolean;
  message: string;
  url?: string;
}

export interface UploadMultipleResponse {
  success: boolean;
  message: string;
  urls?: string[];
}

/*Upload 1 file ảnh lên Cloudinary qua Backend API*/
export const uploadSingleImage = async (
  file: File,
  folder: string = 'courtify/sport_centers'
): Promise<UploadSingleResponse> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const response = await fetch(`${API_BASE_URL}/upload/single`, {
    method: 'POST',
    body: formData,
  });

  return await response.json();
};

/**
 * Upload nhiều file ảnh lên Cloudinary qua Backend API
 */
export const uploadMultipleImages = async (
  files: File[] | FileList,
  folder: string = 'courtify/sport_centers'
): Promise<UploadMultipleResponse> => {
  const formData = new FormData();
  const fileArray = Array.from(files);

  fileArray.forEach((file) => {
    formData.append('images', file);
  });
  formData.append('folder', folder);

  const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
    method: 'POST',
    body: formData,
  });

  return await response.json();
};
