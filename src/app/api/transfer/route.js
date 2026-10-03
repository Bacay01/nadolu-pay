import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { fromAccountId, toAccountNumber, amount, description } = await req.json();
  const numericAmount = Number(amount);

  if (!fromAccountId || !toAccountNumber || !numericAmount || numericAmount <= 0) {
    return NextResponse.json(
      { error: "Source account, recipient account number, and a positive amount are required" },
      { status: 400 }
    );
  }

  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const fromAccount = await tx.account.findFirst({
        where: { id: fromAccountId, userId: session.user.id },
      });
      if (!fromAccount) throw new Error("Source account not found");

      const toAccount = await tx.account.findUnique({ where: { accountNumber: toAccountNumber } });
      if (!toAccount) throw new Error("Recipient account number not found");

      if (toAccount.id === fromAccount.id) throw new Error("Cannot transfer to the same account");
      if (fromAccount.frozen) {
        throw new Error(fromAccount.frozenReason || "This account is frozen and can't send money");
      }
      if (toAccount.frozen) {
        throw new Error(toAccount.frozenReason || "The recipient account is frozen and can't receive money");
      }
      if (Number(fromAccount.balance) < numericAmount) throw new Error("Insufficient funds");

      await tx.account.update({ where: { id: fromAccount.id }, data: { balance: { decrement: numericAmount } } });
      await tx.account.update({ where: { id: toAccount.id }, data: { balance: { increment: numericAmount } } });

      return tx.transaction.create({
        data: {
          amount: numericAmount,
          description: description || null,
          status: "completed",
          fromId: fromAccount.id,
          toId: toAccount.id,
        },
      });
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Transfer failed" }, { status: 400 });
  }
}