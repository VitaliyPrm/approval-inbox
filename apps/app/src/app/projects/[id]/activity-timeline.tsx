"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface Activity {
  id: string;
  action: string;
  details: string | null;
  user_id: string;
  project_id: string;
  created_at: string;
  user: { email: string } | null;
}

export function ActivityTimeline({ projectId }: { projectId: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchActivities = useCallback(async () => {
    const { data } = await supabase
      .from("activity_logs")
      .select("*, user:users(email)")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setActivities(data as unknown as Activity[]);
  }, [projectId, supabase]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  if (activities.length === 0) {
    return (
      <div className="text-sm text-gray-500">No activity yet</div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
          <div className="flex-1">
            <p className="text-sm text-gray-900">
              <span className="font-medium">
                {activity.user?.email ?? "Someone"}
              </span>{" "}
              {activity.action}
            </p>
            {activity.details && (
              <p className="text-xs text-gray-500">{activity.details}</p>
            )}
            <p className="text-xs text-gray-400">
              {new Date(activity.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}