"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPage() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 기존 이미지 목록 불러오기
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("/api/images");
      setImages(response.data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // 이미지 업로드 처리
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchImages(); // 목록 갱신
      alert("업로드 성공!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("업로드 실패");
    }
  };

  // 이미지 삭제 처리
  const handleDelete = async (filename: string) => {
    try {
      await axios.delete(`/api/delete?filename=${filename}`);
      await fetchImages(); // 목록 갱신
      alert("삭제 성공!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("삭제 실패");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">이미지 관리</h1>

      {/* 이미지 업로드 폼 */}
      <form onSubmit={handleUpload} className="mb-8">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          업로드
        </button>
      </form>

      {/* 이미지 목록 표시 */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image} className="relative group">
            <img
              src={`/images/${image}`}
              alt={image}
              className="w-full h-32 object-cover"
            />
            <button
              onClick={() => handleDelete(image)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
