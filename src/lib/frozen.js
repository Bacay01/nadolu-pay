export function getFrozenNotice(accounts) {
  const frozen = accounts.find((a) => a.frozen);
  return frozen ? frozen.frozenReason || "This account is frozen. Please contact support." : null;
}