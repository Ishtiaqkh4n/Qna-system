import { NextResponse } from "next/server";
import getOrCreateDB from "@/models/server/dbSetup";
import getOrCreateStorage from "@/models/server/storage.collection";

export async function GET() {
  try {
    await getOrCreateDB();
    await getOrCreateStorage();
    return NextResponse.json({
      success: true,
      message: "Database and storage setup complete",
    });
  } catch (error) {
    console.error("Setup failed:", error);
    return NextResponse.json(
      { success: false, message: "Setup failed", error: String(error) },
      { status: 500 }
    );
  }
}
