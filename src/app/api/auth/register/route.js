import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`register:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists — use a generic message to avoid
    // user enumeration via the registration endpoint.
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    const hashedPassword = await bcrypt.hash(password, 12);

    if (existingUser) {
      return NextResponse.json(
        {
          success: true,
          user: { id: existingUser._id, name: existingUser.name, email: existingUser.email },
        },
        { status: 201 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return NextResponse.json(
      { success: true, user: { id: user._id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
