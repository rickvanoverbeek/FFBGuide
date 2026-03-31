import type { FFBSetting } from "@/types";
import { cn } from "@/lib/utils";

interface SettingExplainerProps {
  setting: FFBSetting;
  value?: string;
  notes?: string;
}

export function SettingExplainer({ setting, value, notes }: SettingExplainerProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{setting.name}</span>
          {setting.unit && (
            <span className="text-xs text-muted-foreground">({setting.unit})</span>
          )}
        </div>
        {setting.shortDescription && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {setting.shortDescription}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 sm:ml-4">
        {value !== undefined && (
          <span
            className={cn(
              "inline-flex min-w-[3rem] items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold",
              "bg-primary/10 text-primary",
            )}
          >
            {value}
            {setting.unit ? ` ${setting.unit}` : ""}
          </span>
        )}
      </div>

      {notes && (
        <p className="mt-1 text-xs italic text-muted-foreground sm:mt-0 sm:basis-full">
          {notes}
        </p>
      )}
    </div>
  );
}
