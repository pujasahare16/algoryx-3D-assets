'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, PlusCircle, FileCheck, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { href: '/creator', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/creator/assets', label: 'My Assets', icon: Package, exact: true },
  { href: '/creator/assets/new', label: 'Create Asset', icon: PlusCircle, exact: true },
  { href: '/creator/profile', label: 'Profile', icon: User, exact: true },
];

export default function CreatorSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-neutral-800 bg-neutral-950 transition-all duration-200 shrink-0',
          collapsed ? 'w-16' : 'w-56'
        )}
      >
        <div className="flex items-center justify-between p-3 border-b border-neutral-800">
          {!collapsed && (
            <span className="text-[12px] font-medium text-neutral-500 uppercase tracking-wider px-1">Creator</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-neutral-500 hover:text-neutral-300 transition-colors rounded"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>
        <nav className="flex-1 p-2 flex flex-col gap-0.5">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors',
                  active
                    ? 'bg-neutral-800/70 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                )}
                title={collapsed ? link.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-sm">
        <div className="flex items-center justify-around py-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1 rounded-md transition-colors',
                  active ? 'text-teal-400' : 'text-neutral-500'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px]">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
