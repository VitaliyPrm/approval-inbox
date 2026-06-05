import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import crypto from "crypto";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const { data: project } = await supabase
    .from("projects")
    .select("owner_id")
    .eq("id", id)
    .single();

  if (!project || project.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Generate or return existing share token
  const token = crypto.randomBytes(24).toString("hex");

  const { data: shareLink, error } = await supabase
    .from("project_members")
    .insert({
      project_id: id,
      user_id: user.id,
      role: "client",
      share_token: token,
    })
    .select("share_token")
    .single();

  if (error && error.code === "23505") {
    // Token already exists — return existing
    const { data: existing } = await supabase
      .from("project_members")
      .select("share_token")
      .eq("project_id", id)
      .eq("role", "client")
      .single();

    if (existing) {
      return NextResponse.json({
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/c/${existing.share_token}`,
      });
    }
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/c/${shareLink?.share_token}`,
  });
}