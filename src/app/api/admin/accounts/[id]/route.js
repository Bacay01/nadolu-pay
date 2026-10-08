import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { getExchangeRate, SUPPORTED_CURRENCIES } from "@/lib/exchangeRate";

export async function PATCH(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  const { balance, currency, frozen, frozenReason } = await req.json();

  const account = await prisma.account.findUnique({ where: { id } });
  if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const data = {};

  if (currency !== undefined && currency !== account.currency) {
    if (!SUPPORTED_CURRENCIES.includes(currency)) {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
    }
    data.currency = currency;

    if (balance !== undefined) {
      const numeric = Number(balance);
      if (Number.isNaN(numeric)) {
        return NextResponse.json({ error: "Balance must be a number" }, { status: 400 });
      }
      data.balance = numeric;
    } else {
      try {
        const rate = await getExchangeRate(account.currency, currency);
        data.balance = Number((Number(account.balance) * rate).toFixed(2));
      } catch (err) {
        return NextResponse.json(
          { error: "Could not fetch exchange rate. Try again." },
          { status: 502 }
        );
      }
    }
  } else if (balance !== undefined) {
    const numeric = Number(balance);
    if (Number.isNaN(numeric)) {
      return NextResponse.json({ error: "Balance must be a number" }, { status: 400 });
    }
    data.balance = numeric;
  }

  if (frozen !== undefined) data.frozen = Boolean(frozen);
  if (frozenReason !== undefined) data.frozenReason = frozenReason;

  const updated = await prisma.account.update({ where: { id }, data });
  return NextResponse.json({ account: updated });
}
