import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  const { type, amount, description, externalLabel } = await req.json();
  const numericAmount = Number(amount);

  if (!["credit", "debit"].includes(type) || !numericAmount || numericAmount <= 0) {
    return NextResponse.json(
      { error: "A valid type (credit/debit) and a positive amount are required" },
      { status: 400 }
    );
  }

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findUnique({ where: { id } });
      if (!account) throw new Error("Account not found");

      if (type === "credit") {
        await tx.account.update({ where: { id }, data: { balance: { increment: numericAmount } } });
        return tx.transaction.create({
          data: {
            amount: numericAmount,
            description: description || "Manual credit by admin",
            externalLabel: externalLabel || null,
            status: "completed",
            toId: id,
          },
        });
      }

      await tx.account.update({ where: { id }, data: { balance: { decrement: numericAmount } } });
      return tx.transaction.create({
        data: {
          amount: numericAmount,
          description: description || "Manual debit by admin",
          externalLabel: externalLabel || null,
          status: "completed",
          fromId: id,
        },
      });
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to add transaction" }, { status: 400 });
  }
}