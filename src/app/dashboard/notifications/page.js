import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NotificationsView from "@/components/notifications/NotificationsView";

export const metadata = {
  title: "Notifications — Qraft",
  description: "Smart telemetry notifications, QR scan milestones, and proactive security alerts.",
};

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <NotificationsView />;
}
