"use client";

import Link from "next/link";
import FrozenNoticeToast, { useFrozenNotice } from "@/components/FrozenNoticeToast";

export default function FrozenGuardedLink({ href, frozenNotice, className, children }) {
  const { notice, showNotice, dismiss } = useFrozenNotice();

  function handleClick(e) {
    if (frozenNotice) {
      e.preventDefault();
      showNotice(frozenNotice);
    }
  }

  return (
    <>
      <Link href={href} onClick={handleClick} className={className}>
        {children}
      </Link>

      <FrozenNoticeToast notice={notice} onDismiss={dismiss} />
    </>
  );
}