import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Settings, GitCompareArrows, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Tools | FFB Hub",
  description:
    "Sim racing tools: FFB Configurator, hardware comparison, and glossary of force feedback terminology.",
};

const tools = [
  {
    title: "FFB Configurator",
    description:
      "Get recommended FFB settings for your wheel and game. Select your wheelbase and game to see tailored vendor software and in-game settings.",
    href: "/tools/configurator",
    icon: Settings,
  },
  {
    title: "Hardware Compare",
    description:
      "Compare wheelbases side by side. View specs like peak torque, drive type, rotation range, and platform support across multiple devices.",
    href: "/tools/compare",
    icon: GitCompareArrows,
  },
  {
    title: "Glossary",
    description:
      "Look up FFB terminology. A comprehensive dictionary of force feedback terms, settings, and concepts explained in plain language.",
    href: "/tools/glossary",
    icon: BookOpen,
  },
];

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Tools
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Everything you need to configure, compare, and understand force
          feedback for sim racing.
        </p>
      </section>

      {/* Tool cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
