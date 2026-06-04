"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface Comment {
  id: string;
  content: string;
  file_id: string;
  project_id: string;
  user_id: string;
  parent_id: string | null;
  pin_x: number | null;
  pin_y: number | null;
  created_at: string;
  user: { email: string } | null;
}

export function CommentThread({
  fileId,
  projectId,
}: {
  fileId: string;
  projectId: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, user:users(email)")
      .eq("file_id", fileId)
      .order("created_at", { ascending: true });
    if (data) setComments(data as unknown as Comment[]);
    setLoading(false);
  }, [fileId, supabase]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);

    const { error } = await supabase.from("comments").insert({
      file_id: fileId,
      project_id: projectId,
      content: content.trim(),
      user_id: (await supabase.auth.getUser()).data.user?.id,
    });

    if (!error) {
      setContent("");
      await fetchComments();
    }
    setSending(false);
  };

  const topLevel = comments.filter((c) => !c.parent_id);
  const replies = (parentId: string) => comments.filter((c) => c.parent_id === parentId);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {sending ? "..." : "Send"}
        </button>
      </form>

      <div className="space-y-3">
        {topLevel.length === 0 && (
          <p className="text-sm text-gray-500">No comments yet</p>
        )}
        {topLevel.map((comment) => (
          <div key={comment.id} className="rounded-lg border bg-white p-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-medium text-gray-900">
                {comment.user?.email ?? "Unknown"}
              </span>
              {comment.pin_x !== null && (
                <span className="text-xs text-blue-600">📌 pinned</span>
              )}
              <span className="text-xs text-gray-400">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-700">{comment.content}</p>
            {replies(comment.id).map((reply) => (
              <div key={reply.id} className="ml-4 mt-2 border-l-2 border-gray-200 pl-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-900">
                    {reply.user?.email ?? "Unknown"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(reply.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{reply.content}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}