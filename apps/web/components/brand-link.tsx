import Link from "next/link";

export function BrandLink() {
  return (
    <Link href="/" className="flex shrink-0 items-center">
      <span className="text-sm font-semibold">Motion Studio</span>
    </Link>
  );
}
