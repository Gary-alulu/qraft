import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import Folder from "@/models/Folder";
import QRLibraryClient from "./QRLibraryClient";

export default async function QRLibraryPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const userId = session.user.id;

  // Fetch folders and codes
  const foldersRaw = await Folder.find({ userId }).sort({ name: 1 }).lean();
  const codesRaw = await QRCode.find({ userId, status: { $ne: "archived" } })
    .sort({ createdAt: -1 })
    .lean();

  // Serialize Mongoose docs for client
  const folders = foldersRaw.map(f => ({
    _id: f._id.toString(),
    name: f.name,
    color: f.color
  }));

  const codes = codesRaw.map(c => ({
    id: c._id.toString(),
    name: c.title,
    type: c.type,
    scans: c.scansCount || 0,
    status: c.status,
    folderId: c.folderId?.toString() || null,
    date: c.createdAt.toISOString().split("T")[0]
  }));

  return <QRLibraryClient initialFolders={folders} initialCodes={codes} />;
}
