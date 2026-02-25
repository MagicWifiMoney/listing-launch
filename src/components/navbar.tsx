"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-[#1E3A5F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              Listing<span className="text-[#D4AF37]">Launch</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/generate"
                  className="text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Generate
                </Link>
                <Link
                  href="/history"
                  className="text-sm hover:text-[#D4AF37] transition-colors"
                >
                  History
                </Link>
                <Link
                  href="/settings"
                  className="text-sm hover:text-[#D4AF37] transition-colors"
                >
                  Settings
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-white hover:text-[#D4AF37] hover:bg-white/10"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-[#D4AF37] hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-[#D4AF37] text-[#1E3A5F] hover:bg-[#c9a432] font-semibold"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
