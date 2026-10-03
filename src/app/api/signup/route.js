import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { name, email, password, pin } = await req.json();

  if (!name || !email || !password || !pin) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const pinHash = await bcrypt.hash(pin, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      pinHash,
      accounts: {
        create: [
          { type: "checking", balance: 1000.0 },
          { type: "savings", balance: 500.0 },
        ],
      },
      creditCards: {
        create: [{ creditLimit: 2000.0, balance: 0 }],
      },
    },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}