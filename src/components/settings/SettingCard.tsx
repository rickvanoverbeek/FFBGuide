import Link from "next/link";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import type { Setting } from "@/lib/content/loader";

interface SettingCardProps {
  setting: Setting;
  /** Show which manufacturer this belongs to (needed outside a manufacturer page). */
  showManufacturer?: boolean;
  className?: string;
}

export function SettingCard({
  setting,
  showManufacturer = false,
  className,
}: SettingCardProps) {
  return (
    <Link
      href={setting.href}
      className={cn(
        "block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/50",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {showManufacturer && (
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {setting.manufacturerName}
            </p>
          )}
          <h3 className="font-semibold text-foreground">{setting.setting_name}</h3>
        </div>
        <StatusBadge status={setting.status} />
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {setting.summary}
      </p>
    </Link>
  );
}
