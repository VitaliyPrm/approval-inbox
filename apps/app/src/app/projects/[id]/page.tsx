import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { FileUpload } from "./file-upload";
import { FileList } from "./file-list";
import { CommentThread } from "./comment-thread";
import { ApprovalStatus } from "./approval-status";
import { ActivityTimeline } from "./activity-timeline";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  const { data: files } = await supabase.storage
    .from("project-files")
    .list(id, {
      sortBy: { column: "created_at", order: "desc" },
    });

  const mappedFiles = (files ?? []).map((f) => ({
    name: f.name,
    id: f.id,
    created_at: f.created_at,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        {project.description && (
          <p className="mt-1 text-gray-600">{project.description}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-lg font-semibold">Upload files</h2>
            <FileUpload projectId={id} />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Files</h2>
            <FileList files={mappedFiles} projectId={id} />
          </section>

          {mappedFiles.length > 0 && (
            <section className="space-y-6">
              {mappedFiles.map((file) => (
                <div key={file.id ?? file.name} className="rounded-xl border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium">{file.name}</h3>
                    <ApprovalStatus fileId={file.id ?? file.name} projectId={id} />
                  </div>
                  <CommentThread fileId={file.id ?? file.name} projectId={id} />
                </div>
              ))}
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border bg-white p-4">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Activity
            </h2>
            <ActivityTimeline projectId={id} />
          </section>
        </aside>
      </div>
    </div>
  );
}