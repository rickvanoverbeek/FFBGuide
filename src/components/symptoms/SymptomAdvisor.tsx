"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, HelpCircle, Power, PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIRECTION_LABELS, type Direction } from "@/lib/content/schema";

export interface AdvisorSetting {
  name: string;
  software: string;
  href: string;
  direction: Direction;
  directionUnclear: boolean;
  isDraft: boolean;
}

export interface AdvisorStep {
  conceptSlug: string;
  conceptLabel: string;
  conceptHref: string;
  /** Direction before polarity, used when no manufacturer is chosen. */
  direction: Direction;
  why: string;
  settings: AdvisorSetting[];
}

export interface AdvisorManufacturer {
  slug: string;
  name: string;
  software: string;
}

interface SymptomAdvisorProps {
  manufacturers: AdvisorManufacturer[];
  /** Per manufacturer slug, the advice resolved into their own controls. */
  stepsByManufacturer: Record<string, AdvisorStep[]>;
  /** Concept-level advice, shown until a manufacturer is chosen. */
  genericSteps: AdvisorStep[];
}

const STORAGE_KEY = "ffbguide.manufacturer";

/**
 * The chosen base lives in localStorage rather than in component state, so it
 * survives navigation between symptom pages and stays in step across tabs.
 * Reading it through useSyncExternalStore keeps hydration honest: the server and
 * the first client render both see "", and React re-renders once with the stored
 * value instead of us patching state inside an effect.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getStored() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

function getStoredOnServer() {
  return "";
}

function setStored(value: string) {
  if (value) {
    window.localStorage.setItem(STORAGE_KEY, value);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  for (const listener of listeners) listener();
}

function DirectionPill({
  direction,
  unclear,
}: {
  direction: Direction;
  unclear: boolean;
}) {
  if (unclear) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground"
        title="The manufacturer does not document which way this control moves, so we will not guess"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        Direction not documented
      </span>
    );
  }

  const Icon =
    direction === "raise"
      ? ArrowUp
      : direction === "lower"
        ? ArrowDown
        : direction === "on"
          ? Power
          : PowerOff;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs font-medium text-link">
      <Icon className="h-3.5 w-3.5" />
      {DIRECTION_LABELS[direction]}
    </span>
  );
}

export function SymptomAdvisor({
  manufacturers,
  stepsByManufacturer,
  genericSteps,
}: SymptomAdvisorProps) {
  const stored = useSyncExternalStore(subscribe, getStored, getStoredOnServer);
  // A stale value from an earlier visit must not select a manufacturer we no
  // longer have advice for.
  const selected = stored in stepsByManufacturer ? stored : "";

  const steps = useMemo(
    () => (selected ? stepsByManufacturer[selected] ?? genericSteps : genericSteps),
    [selected, stepsByManufacturer, genericSteps]
  );

  const manufacturer = manufacturers.find((m) => m.slug === selected);

  return (
    <div>
      {/* Manufacturer picker */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-muted-foreground">
          Your wheel base
        </span>
        {manufacturers.map((option) => {
          const on = option.slug === selected;
          return (
            <button
              key={option.slug}
              type="button"
              onClick={() => setStored(on ? "" : option.slug)}
              aria-pressed={on}
              title={option.software}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                on
                  ? "border-primary/40 bg-primary/10 text-link"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {option.name}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {manufacturer
          ? `Showing the controls in ${manufacturer.software}, in the order worth trying.`
          : "Pick your base to see the exact control names. Until then, the advice is shown per concept."}
      </p>

      {/* Advice */}
      <ol className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <li
            key={step.conceptSlug}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <div>
                  {step.settings.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      {step.settings.map((setting) => (
                        <Link
                          key={setting.href}
                          href={setting.href}
                          className="font-semibold text-foreground hover:text-link"
                        >
                          {setting.name}
                          {setting.isDraft && (
                            <span className="ml-1 align-middle text-xs font-normal text-muted-foreground">
                              ·draft
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={step.conceptHref}
                      className="font-semibold text-foreground hover:text-link"
                    >
                      {step.conceptLabel}
                    </Link>
                  )}
                  {step.settings.length > 0 && (
                    <Link
                      href={step.conceptHref}
                      className="mt-0.5 block text-xs text-muted-foreground hover:text-foreground"
                    >
                      {step.conceptLabel}
                    </Link>
                  )}
                </div>
              </div>

              {step.settings.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {step.settings.map((setting) => (
                    <DirectionPill
                      key={setting.href}
                      direction={setting.direction}
                      unclear={setting.directionUnclear}
                    />
                  ))}
                </div>
              ) : (
                <DirectionPill direction={step.direction} unclear={false} />
              )}
            </div>

            <p className="mt-3 leading-7 text-muted-foreground">{step.why}</p>

            {manufacturer && step.settings.length === 0 && (
              <p className="mt-3 rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
                {manufacturer.software} has no documented control for this. Skip
                to the next step — or check{" "}
                <Link
                  href={step.conceptHref}
                  className="text-link hover:underline"
                >
                  what the other manufacturers call it
                </Link>
                , in case yours has it under a name we have not recorded.
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
