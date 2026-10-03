import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { toAccountId, cardLast4, amount } = await req.json();
  const numericAmount = Number(amount);

  if (!toAccountId || !cardLast4 || !/^\d{4}$/.test(cardLast4) || !numericAmount || numericAmount <= 0) {
    return NextResponse.json(
      { error: "Destination account, last 4 card digits, and a positive amount are required" },
      { status: 400 }
    );
  }

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const toAccount = await tx.account.findFirst({
        where: { id: toAccountId, userId: session.user.id },
      });
      if (!toAccount) throw new Error("Destination account not found");

      if (toAccount.frozen) {
        throw new Error(toAccount.frozenReason || "This account is frozen and can't accept deposits");
      }

      await tx.account.update({ where: { id: toAccount.id }, data: { balance: { increment: numericAmount } } });

      return tx.transaction.create({
        data: {
          amount: numericAmount,
          description: `Card deposit ••${cardLast4}`,
          status: "completed",
          toId: toAccount.id,
        },
      });
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Deposit failed" }, { status: 400 });
  }
}