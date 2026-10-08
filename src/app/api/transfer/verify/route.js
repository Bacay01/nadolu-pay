import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { pendingTransferId, code } = await req.json();

  if (!pendingTransferId || !code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const pending = await prisma.pendingTransfer.findUnique({ where: { id: pendingTransferId } });

  if (!pending || pending.userId !== session.user.id) {
    return NextResponse.json({ error: "Transfer request not found" }, { status: 404 });
  }
  if (pending.status !== "pending") {
    return NextResponse.json({ error: "This transfer was already completed or cancelled" }, { status: 400 });
  }
  if (new Date(pending.expiresAt) < new Date()) {
    await prisma.pendingTransfer.update({ where: { id: pending.id }, data: { status: "expired" } });
    return NextResponse.json({ error: "Code expired. Please start the transfer again." }, { status: 400 });
  }
  if (String(code).trim() !== pending.otpCode) {
    return NextResponse.json({ error: "Incorrect code" }, { status: 400 });
  }

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const fromAccount = await tx.account.findFirst({
        where: { id: pending.fromAccountId, userId: session.user.id },
      });
      if (!fromAccount) throw new Error("Source account not found");

      const toAccount = await tx.account.findUnique({ where: { accountNumber: pending.toAccountNumber } });
      if (!toAccount) throw new Error("Recipient account number not found");

      if (toAccount.id === fromAccount.id) throw new Error("Cannot transfer to the same account");
      if (fromAccount.frozen) {
        throw new Error(fromAccount.frozenReason || "This account is frozen and can't send money");
      }
      if (toAccount.frozen) {
        throw new Error(toAccount.frozenReason || "The recipient account is frozen and can't receive money");
      }

      const numericAmount = Number(pending.amount);
      if (Number(fromAccount.balance) < numericAmount) throw new Error("Insufficient funds");

      await tx.account.update({ where: { id: fromAccount.id }, data: { balance: { decrement: numericAmount } } });
      await tx.account.update({ where: { id: toAccount.id }, data: { balance: { increment: numericAmount } } });

      const created = await tx.transaction.create({
        data: {
          amount: numericAmount,
          description: pending.description,
          status: "completed",
          fromId: fromAccount.id,
          toId: toAccount.id,
        },
      });

      await tx.pendingTransfer.update({ where: { id: pending.id }, data: { status: "completed" } });

      return created;
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Transfer failed" }, { status: 400 });
  }
}
