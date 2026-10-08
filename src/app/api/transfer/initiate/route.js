import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { fromAccountId, toAccountName, toAccountType, toAccountNumber, amount, description } = await req.json();
  const numericAmount = Number(amount);

  if (!fromAccountId || !toAccountNumber || !numericAmount || numericAmount <= 0) {
    return NextResponse.json(
      { error: "Source account, recipient account number, and a positive amount are required" },
      { status: 400 }
    );
  }

  const fromAccount = await prisma.account.findFirst({
    where: { id: fromAccountId, userId: session.user.id },
  });
  if (!fromAccount) {
    return NextResponse.json({ error: "Source account not found" }, { status: 404 });
  }
  const toAccount = await prisma.account.findUnique({ where: { accountNumber: toAccountNumber } });
  if (toAccount && toAccount.id === fromAccount.id) {
    return NextResponse.json({ error: "Cannot transfer to the same account" }, { status: 400 });
  }
  if (Number(fromAccount.balance) < numericAmount) {
    return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
  }

  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const pending = await prisma.pendingTransfer.create({
    data: {
      userId: session.user.id,
      userName: session.user.name || session.user.email || "Customer",
      fromAccountId: fromAccount.id,
      fromAccountNumber: fromAccount.accountNumber,
      toAccountNumber,
      toAccountName: toAccountName || null,
      toAccountType: toAccountType || null,
      amount: numericAmount,
      currency: fromAccount.currency,
      description: description || null,
      otpCode,
      expiresAt,
    },
  });

  return NextResponse.json({ pendingTransferId: pending.id, expiresAt: pending.expiresAt });
}
