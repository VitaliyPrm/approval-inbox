import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user.email}
          </p>
        </div>
        <Link
          href="/projects/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New project
        </Link>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Projects</h2>
        </div>

        {projects && projects.length > 0 ? (
          <ul className="divide-y">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <span className="font-medium">{project.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-lg">No projects yet</p>
            <p className="mt-1 text-sm">Create your first project to get started.</p>
            <Link
              href="/projects/new"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}