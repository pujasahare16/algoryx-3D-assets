'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Explore' },
  { href: '/creator', label: 'Creator' },
  { href: '/resources', label: 'Resources' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, creator, signIn, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 lg:px-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold text-[15px] tracking-tight">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-teal-600 text-[11px] font-bold text-white">A</span>
            Algoryx
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 text-[13px] rounded-md transition-colors',
                  pathname === link.href
                    ? 'text-white bg-neutral-800/60'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Auth + CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/creator/assets/new"
                className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-teal-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Asset
              </Link>
              <div className="flex items-center gap-2 ml-1">
                <Link
                  href="/creator/profile"
                  className="text-[13px] text-neutral-400 hover:text-neutral-200 transition-colors px-2 py-1.5"
                >
                  {creator?.creatorName || 'Profile'}
                </Link>
                <button
                  onClick={signOut}
                  className="text-[13px] text-neutral-500 hover:text-neutral-300 transition-colors px-2 py-1.5"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={signIn}
                className="text-[13px] text-neutral-400 hover:text-neutral-200 transition-colors px-3 py-1.5"
              >
                Sign In
              </button>
              <Link
                href="/creator/assets/new"
                className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-teal-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Asset
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1.5 text-neutral-400 hover:text-white transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-3">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-2 text-[13px] rounded-md transition-colors',
                  pathname === link.href
                    ? 'text-white bg-neutral-800/60'
                    : 'text-neutral-400 hover:text-neutral-200'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-neutral-800 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/creator/assets/new"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 px-3 py-2 text-[13px] text-teal-400"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Create Asset
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="px-3 py-2 text-[13px] text-neutral-400 hover:text-neutral-200 w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { signIn(); setMobileOpen(false); }}
                  className="px-3 py-2 text-[13px] text-neutral-400 hover:text-neutral-200 w-full text-left"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
