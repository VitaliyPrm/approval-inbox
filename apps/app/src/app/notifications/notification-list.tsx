"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface INotification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  created_at: string;
  actor: { email: string } | null;
}

export function NotificationList({
  notifications: initial,
}: {
  notifications: INotification[];
}) {
  const [notifications, setNotifications] = useState(initial);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const markAllRead = async () => {
    const ids = notifications.filter((n) => !n.read).map((n) => n.id);
    if (ids.length === 0) return;

    await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", ids);

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    router.refresh();
  };

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border bg-white px-6 py-12 text-center text-gray-500">
        <p>No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-3">
        <span className="text-sm font-medium text-gray-700">
          {notifications.filter((n) => !n.read).length} unread
        </span>
        <button
          onClick={markAllRead}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <ul className="divide-y">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`px-6 py-4 ${!notification.read ? "bg-blue-50/50" : ""}`}
          >
            {notification.link ? (
              <Link
                href={notification.link}
                className="block hover:opacity-80"
              >
                <NotificationRow notification={notification} />
              </Link>
            ) : (
              <NotificationRow notification={notification} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotificationRow({ notification }: { notification: INotification }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-1.5 h-2 w-2 rounded-full ${
          !notification.read ? "bg-blue-500" : "bg-gray-300"
        }`}
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {notification.title}
        </p>
        <p className="text-sm text-gray-600">{notification.message}</p>
        <p className="mt-1 text-xs text-gray-400">
          {new Date(notification.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}