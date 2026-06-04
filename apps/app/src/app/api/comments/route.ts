import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const file_id = searchParams.get("file_id");
  if (!file_id) return NextResponse.json({ error: "file_id required" }, { status: 400 });

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*, user:users(email)")
    .eq("file_id", file_id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { file_id, project_id, content, parent_id, pin_x, pin_y } = body;

  if (!file_id || !project_id || !content) {
    return NextResponse.json({ error: "file_id, project_id, content required" }, { status: 400 });
  }

  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      file_id,
      project_id,
      user_id: user.id,
      content,
      parent_id: parent_id ?? null,
      pin_x: pin_x ?? null,
      pin_y: pin_y ?? null,
    })
    .select("*, user:users(email)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(comment, { status: 201 });
}