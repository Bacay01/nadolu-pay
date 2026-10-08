import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { getExchangeRate, SUPPORTED_CURRENCIES } from "@/lib/exchangeRate";

export async function PATCH(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  const { balance, creditLimit, currency } = await req.json();

  const card = await prisma.creditCard.findUnique({ where: { id } });
  if (!card) return NextResponse.json({ error: "Credit card not found" }, { status: 404 });

  const data = {};

  if (currency !== undefined && currency !== card.currency) {
    if (!SUPPORTED_CURRENCIES.includes(currency)) {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
    }
    data.currency = currency;

    let rate = null;
    if (balance === undefined || creditLimit === undefined) {
      try {
        rate = await getExchangeRate(card.currency, currency);
      } catch (err) {
        return NextResponse.json(
          { error: "Could not fetch exchange rate. Try again." },
          { status: 502 }
        );
      }
    }

    if (balance !== undefined) {
      const numeric = Number(balance);
      if (Number.isNaN(numeric)) {
        return NextResponse.json({ error: "Balance must be a number" }, { status: 400 });
      }
      data.balance = numeric;
    } else {
      data.balance = Number((Number(card.balance) * rate).toFixed(2));
    }

    if (creditLimit !== undefined) {
      const numeric = Number(creditLimit);
      if (Number.isNaN(numeric)) {
        return NextResponse.json({ error: "Credit limit must be a number" }, { status: 400 });
      }
      data.creditLimit = numeric;
    } else {
      data.creditLimit = Number((Number(card.creditLimit) * rate).toFixed(2));
    }
  } else {
    if (balance !== undefined) {
      const numeric = Number(balance);
      if (Number.isNaN(numeric)) {
        return NextResponse.json({ error: "Balance must be a number" }, { status: 400 });
      }
      data.balance = numeric;
    }
    if (creditLimit !== undefined) {
      const numeric = Number(creditLimit);
      if (Number.isNaN(numeric)) {
        return NextResponse.json({ error: "Credit limit must be a number" }, { status: 400 });
      }
      data.creditLimit = numeric;
    }
  }

  const updated = await prisma.creditCard.update({ where: { id }, data });
  return NextResponse.json({ card: updated });
}
