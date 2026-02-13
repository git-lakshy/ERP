import Link from "next/link";
import { Package } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-red-600/10 p-4 border border-red-600/20">
          <Package className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Sellable <span className="text-red-600">ERP</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-md">
          Enterprise Resource Planning for the Modern Era.
        </p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
