"use client";

import dynamic from "next/dynamic";
import type { AdminAnalyticsProps } from "@/components/dashboard/admin-analytics";

const AdminAnalytics = dynamic(() => import("@/components/dashboard/admin-analytics"), {
  ssr: false,
});

export default function AdminAnalyticsClient(props: AdminAnalyticsProps) {
  return <AdminAnalytics {...props} />;
}
