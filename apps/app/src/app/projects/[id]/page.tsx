import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { FileUpload } from "./file-upload";
import { FileList } from "./file-list";

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

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-lg font-semibold">Upload files</h2>
          <FileUpload projectId={id} />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Files</h2>
          <FileList files={mappedFiles} projectId={id} />
        </section>
      </div>
    </div>
  );
}