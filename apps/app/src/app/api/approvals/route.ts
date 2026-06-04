import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { file_id, project_id, status } = body;

  if (!file_id || !project_id || !["approved", "rejected", "changes_requested"].includes(status)) {
    return NextResponse.json({ error: "file_id, project_id, and valid status required" }, { status: 400 });
  }

  const { data: approval, error } = await supabase
    .from("approvals")
    .upsert(
      { file_id, project_id, user_id: user.id, status },
      { onConflict: "file_id,user_id" }
    )
    .select("*, user:users(email)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(approval, { status: 201 });
}