"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export function FileUpload({ projectId }: { projectId: string }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const uploadFiles = useCallback(
    async (files: FileList) => {
      setUploading(true);
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        const filePath = `${projectId}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("project-files")
          .upload(filePath, file);

        if (error) {
          console.error(`Failed to upload ${file.name}:`, error.message);
        }
      }

      setUploading(false);
      router.refresh();
    },
    [projectId, supabase.storage, router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [uploadFiles]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        dragOver
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      {uploading ? (
        <div className="space-y-2">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm text-gray-600">Uploading files...</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <label className="cursor-pointer text-blue-600 hover:underline">
              Click to upload
              <input
                type="file"
                multiple
                onChange={handleChange}
                className="hidden"
              />
            </label>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-400">
            Images, PDFs, videos, audio, and more
          </p>
        </div>
      )}
    </div>
  );
}