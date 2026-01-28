import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { image: 32, text: "text-lg" },
    md: { image: 40, text: "text-xl" },
    lg: { image: 56, text: "text-2xl" },
  };

  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt="HOTR Port Harcourt"
        width={sizes[size].image}
        height={sizes[size].image}
        className="dark:invert"
        priority
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-foreground leading-tight ${sizes[size].text}`}>
            HOTR PHC
          </span>
          <span className="text-xs text-muted-foreground">Calendar</span>
        </div>
      )}
    </Link>
  );
}
