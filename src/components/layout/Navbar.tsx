"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full",
          "bg-background/80 backdrop-blur-md",
          "border-b border-border"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">FFB</span>
            <span>Hub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const hasChildren = "children" in item && item.children;

              if (hasChildren) {
                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "text-foreground bg-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </Link>

                    {/* Dropdown */}
                    <div
                      className={cn(
                        "absolute left-0 top-full pt-1",
                        "invisible opacity-0 group-hover:visible group-hover:opacity-100",
                        "transition-all duration-150"
                      )}
                    >
                      <div className="w-52 rounded-lg border border-border bg-popover p-1 shadow-lg">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm transition-colors",
                              isActive(child.href)
                                ? "text-foreground bg-accent"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link
              href="/account/login"
              className={cn(
                "hidden md:inline-flex items-center rounded-md px-4 py-2 text-sm font-medium",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              )}
            >
              Sign In
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
