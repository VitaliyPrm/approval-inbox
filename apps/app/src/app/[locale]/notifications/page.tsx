import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { NotificationList, type INotification } from "./notification-list";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: rawNotifications } = await supabase
    .from("notifications")
    .select("*, actor:users!actor_id(email)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const notifications: INotification[] = (rawNotifications ?? []).map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    read: n.read ?? false,
    link: n.link ?? null,
    created_at: n.created_at,
    actor: n.actor ?? null,
  }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <p className="mt-1 text-sm text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <NotificationList notifications={notifications} />
    </div>
  );
}