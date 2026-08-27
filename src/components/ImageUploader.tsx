'use client';

import React, { useState } from 'react';
import { uploadMultipleImages, uploadSingleImage } from '@/services/uploadService';

interface ImageUploaderProps {
  multiple?: boolean;
  onUploadSuccess?: (urls: string[]) => void;
  folder?: string;
}

export default function ImageUploader({
  multiple = true,
  onUploadSuccess,
  folder = 'courtify/sport_centers',
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Tạo preview URL local cho trình duyệt
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
    setErrorMsg('');
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setErrorMsg('Vui lòng chọn ảnh trước khi upload!');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      if (multiple) {
        const res = await uploadMultipleImages(selectedFiles, folder);
        if (res.success && res.urls) {
          setUploadedUrls(res.urls);
          if (onUploadSuccess) onUploadSuccess(res.urls);
        } else {
          setErrorMsg(res.message || 'Upload ảnh thất bại');
        }
      } else {
        const res = await uploadSingleImage(selectedFiles[0], folder);
        if (res.success && res.url) {
          setUploadedUrls([res.url]);
          if (onUploadSuccess) onUploadSuccess([res.url]);
        } else {
          setErrorMsg(res.message || 'Upload ảnh thất bại');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối tới máy chủ API');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white max-w-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {multiple ? 'Upload bộ ảnh Cụm Sân' : 'Upload ảnh đại diện'}
      </h3>

      <div className="flex flex-col space-y-2">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
        <span className="text-xs text-gray-500">
          Chấp nhận định dạng ảnh (JPG, PNG, WEBP), tối đa 5MB / ảnh.
        </span>
      </div>

      {/* Xem trước ảnh (Preview Local) */}
      {previewUrls.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Xem trước ({previewUrls.length} ảnh):</p>
          <div className="flex gap-2 flex-wrap">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx}`}
                className="w-20 h-20 object-cover rounded-md border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Nút bấm upload */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={isUploading || selectedFiles.length === 0}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {isUploading ? 'Đang tải ảnh lên Cloudinary...' : 'Tải ảnh lên Cloudinary'}
      </button>

      {/* Thông báo lỗi */}
      {errorMsg && (
        <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
      )}

      {/* Danh sách ảnh đã upload lên Cloudinary */}
      {uploadedUrls.length > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-xs space-y-1">
          <p className="font-semibold text-green-800">✅ Đã tải thành công {uploadedUrls.length} ảnh lên Cloudinary:</p>
          <ul className="list-disc pl-4 text-green-700 break-all space-y-1">
            {uploadedUrls.map((url, idx) => (
              <li key={idx}>
                <a href={url} target="_blank" rel="noreferrer" className="underline hover:text-green-900">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
