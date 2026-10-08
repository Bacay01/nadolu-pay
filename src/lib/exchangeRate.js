const SUPPORTED_CURRENCIES = ["TRY", "USD", "GBP", "EUR"];

export async function getExchangeRate(from, to) {
  if (from === to) return 1;
  if (!SUPPORTED_CURRENCIES.includes(from) || !SUPPORTED_CURRENCIES.includes(to)) {
    throw new Error("Unsupported currency");
  }

  const res = await fetch(
    `https://api.frankfurter.dev/v1/latest?from=${from}&to=${to}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Exchange rate lookup failed");

  const data = await res.json();
  const rate = data?.rates?.[to];

  if (typeof rate !== "number") throw new Error("Exchange rate not found");

  return rate;
}

export { SUPPORTED_CURRENCIES };
