import Image from "next/image";

export default function AnadoluLogo({ className = "" }) {
  return (
    <>
      <Image
        src="/logo-white.png"
        alt="Anadolu-Bank logo"
        width={64}
        height={64}
        className={`hidden md:block ${className}`}
      />
      <Image
        src="/logo-blue.png"
        alt="Anadolu-Bank logo"
        width={64}
        height={64}
        className={`block md:hidden ${className}`}
      />
    </>
  );
}