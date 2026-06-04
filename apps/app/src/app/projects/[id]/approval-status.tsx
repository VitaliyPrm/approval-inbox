"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type ApprovalStatus = "approved" | "rejected" | "changes_requested";

export function ApprovalStatus({
  fileId,
  projectId,
  currentStatus,
}: {
  fileId: string;
  projectId: string;
  currentStatus?: ApprovalStatus | null;
}) {
  const [status, setStatus] = useState<ApprovalStatus | null>(currentStatus ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleAction = async (newStatus: ApprovalStatus) => {
    setLoading(true);
    setError(null);

    const { error: apiError } = await supabase.from("approvals").upsert(
      { file_id: fileId, project_id: projectId, status: newStatus },
      { onConflict: "file_id,user_id" }
    );

    if (apiError) {
      setError(apiError.message);
    } else {
      setStatus(newStatus);
    }
    setLoading(false);
  };

  const baseClass =
    "rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={() => handleAction("approved")}
          disabled={loading}
          className={`${baseClass} ${
            status === "approved"
              ? "bg-green-600 text-white"
              : "border border-green-300 text-green-700 hover:bg-green-50"
          }`}
        >
          ✅ Approve
        </button>
        <button
          onClick={() => handleAction("changes_requested")}
          disabled={loading}
          className={`${baseClass} ${
            status === "changes_requested"
              ? "bg-yellow-500 text-white"
              : "border border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          }`}
        >
          🔄 Changes
        </button>
        <button
          onClick={() => handleAction("rejected")}
          disabled={loading}
          className={`${baseClass} ${
            status === "rejected"
              ? "bg-red-600 text-white"
              : "border border-red-300 text-red-700 hover:bg-red-50"
          }`}
        >
          ❌ Reject
        </button>
      </div>
      {loading && <p className="text-xs text-gray-500">Saving...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {status && !loading && (
        <p className="text-xs text-gray-500">
          Status: <span className="font-medium">{status}</span>
        </p>
      )}
    </div>
  );
}