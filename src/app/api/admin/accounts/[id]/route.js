import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  const { balance, frozen, frozenReason } = await req.json();

  const data = {};
  if (balance !== undefined) {
    const numeric = Number(balance);
    if (Number.isNaN(numeric)) {
      return NextResponse.json({ error: "Balance must be a number" }, { status: 400 });
    }
    data.balance = numeric;
  }
  if (frozen !== undefined) data.frozen = Boolean(frozen);
  if (frozenReason !== undefined) data.frozenReason = frozenReason;

  const account = await prisma.account.update({ where: { id }, data });
  return NextResponse.json({ account });
}