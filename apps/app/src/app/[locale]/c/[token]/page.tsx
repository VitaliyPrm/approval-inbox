import { createAdminClient } from "@approval-inbox/database";
import { notFound } from "next/navigation";
import { ClientFileList } from "./client-file-list";
import { ClientCommentSection } from "./client-comment-section";

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createAdminClient();

  // Validate share token
  const { data: member } = await supabase
    .from("project_members")
    .select("project_id, role")
    .eq("share_token", token)
    .eq("role", "client")
    .single();

  if (!member) {
    notFound();
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, description")
    .eq("id", member.project_id)
    .single();

  if (!project) {
    notFound();
  }

  const { data: files } = await supabase.storage
    .from("project-files")
    .list(project.id, {
      sortBy: { column: "created_at", order: "desc" },
    });

  const mappedFiles = (files ?? []).map((f) => ({
    name: f.name,
    id: f.id,
    created_at: f.created_at,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>🔗 Client access</span>
          <span>·</span>
          <span>{project.name}</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold">{project.name}</h1>
        {project.description && (
          <p className="mt-1 text-gray-600">{project.description}</p>
        )}
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Files</h2>
        <ClientFileList
          files={mappedFiles}
          projectId={project.id}
          shareToken={token}
        />
      </section>

      {mappedFiles.map((file) => (
        <section key={file.id ?? file.name} className="mb-8">
          <div className="mb-3 rounded-lg bg-blue-50 p-3">
            <h3 className="font-medium">{file.name}</h3>
          </div>
          <ClientCommentSection
            fileId={file.id ?? file.name}
            projectId={project.id}
            shareToken={token}
          />
        </section>
      ))}
    </div>
  );
}