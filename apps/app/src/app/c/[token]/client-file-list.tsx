"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useCallback } from "react";

interface StorageFile {
  name: string;
  id: string | null;
  created_at: string | null;
}

export function ClientFileList({
  files,
  projectId,
  shareToken,
}: {
  files: StorageFile[];
  projectId: string;
  shareToken: string;
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const getFileUrl = useCallback(
    async (fileName: string) => {
      const { data } = await supabase.storage
        .from("project-files")
        .createSignedUrl(`${projectId}/${fileName}`, 3600);
      return data?.signedUrl;
    },
    [projectId, supabase.storage]
  );

  if (files.length === 0) {
    return (
      <div className="rounded-xl border bg-white px-6 py-12 text-center text-gray-500">
        <p>No files in this project yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <ul className="divide-y">
        {files.map((file) => (
          <li key={file.id ?? file.name} className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <FileIcon fileName={file.name} />
              <p className="text-sm font-medium">{file.name}</p>
            </div>
            <button
              onClick={async () => {
                const url = await getFileUrl(file.name);
                if (url) window.open(url, "_blank");
              }}
              className="rounded-md border px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FileIcon({ fileName }: { fileName: string }) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext ?? ""))
    return <span className="text-lg">🖼️</span>;
  if (["pdf"].includes(ext ?? "")) return <span className="text-lg">📄</span>;
  if (["mp4", "mov", "webm"].includes(ext ?? ""))
    return <span className="text-lg">🎬</span>;
  if (["mp3", "wav", "ogg"].includes(ext ?? ""))
    return <span className="text-lg">🎵</span>;
  return <span className="text-lg">📁</span>;
}