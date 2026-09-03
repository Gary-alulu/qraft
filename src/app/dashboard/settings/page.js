import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings | Qraft",
  description: "Manage your Qraft account preferences.",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const userRaw = await User.findById(session.user.id).select("-password").lean();

  const user = {
    id: userRaw._id.toString(),
    name: userRaw.name,
    email: userRaw.email,
    company: userRaw.company || "",
    jobTitle: userRaw.jobTitle || "",
    avatar: userRaw.avatar || "",
    timezone: userRaw.timezone || "UTC",
    language: userRaw.language || "en",
    plan: userRaw.plan || "free",
    notifications: userRaw.notifications || {},
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "100px" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.5rem" }}>
          Account Settings
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "1.0625rem" }}>
          Manage your profile, preferences, and billing.
        </p>
      </div>

      <SettingsClient user={user} />
    </div>
  );
}
