import Link from "next/link";
import {
  Gauge,
  Gamepad2,
  BookOpen,
  Settings,
  ArrowRight,
  Zap,
  GitCompareArrows,
  Upload,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-gradient-start/10 via-transparent to-gradient-end/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Zap className="h-3.5 w-3.5 text-accent" />
            The ultimate sim racing force feedback resource
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Master Your{" "}
            <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
              Force Feedback
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Learn about every FFB setting across every wheelbase and game.
            Configure, compare, and share profiles with the sim racing community.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/vendors"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gradient-start to-gradient-end px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Explore Vendors
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/profiles"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-muted"
            >
              Browse Profiles
              <Users className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything FFB in One Place</h2>
            <p className="mt-3 text-muted-foreground">
              From beginner guides to advanced configuration tools
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              href="/vendors"
              icon={<Gauge className="h-6 w-6" />}
              title="Wheel Vendors"
              description="Simucube, Fanatec, Moza, Asetek, VRS, VNM, Conspit — every setting explained for each vendor's software."
            />
            <FeatureCard
              href="/games"
              icon={<Gamepad2 className="h-6 w-6" />}
              title="Sim Racing Games"
              description="iRacing, ACC, Assetto Corsa, rFactor 2, and more. Understand in-game FFB settings for every title."
            />
            <FeatureCard
              href="/profiles"
              icon={<Upload className="h-6 w-6" />}
              title="Profile Library"
              description="Browse, download, and share community FFB profiles. Rate and compare settings from other drivers."
            />
            <FeatureCard
              href="/learn"
              icon={<BookOpen className="h-6 w-6" />}
              title="Learn"
              description="Educational guides on FFB fundamentals — what is FFB, clipping, signal chain, Direct Drive vs Belt Drive."
            />
            <FeatureCard
              href="/tools/configurator"
              icon={<Settings className="h-6 w-6" />}
              title="FFB Configurator"
              description="Select your wheelbase and game to get recommended FFB settings instantly. Shareable results."
            />
            <FeatureCard
              href="/tools/compare"
              icon={<GitCompareArrows className="h-6 w-6" />}
              title="Compare Hardware"
              description="Compare wheelbases side by side — specs, torque, settings support, and platform compatibility."
            />
          </div>
        </div>
      </section>

      {/* Vendors Showcase */}
      <section className="py-20 bg-muted/50 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Supported Vendors</h2>
            <p className="mt-3 text-muted-foreground">
              Comprehensive FFB guides for all major wheel manufacturers
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              "Simucube",
              "Fanatec",
              "Moza",
              "Asetek",
              "VRS",
              "VNM",
              "Conspit",
            ].map((vendor) => (
              <Link
                key={vendor}
                href={`/vendors/${vendor.toLowerCase()}`}
                className="rounded-xl border border-border bg-card px-6 py-4 text-lg font-semibold transition hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
              >
                {vendor}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Share Your FFB Settings</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Help the community by uploading your force feedback profiles. Get
            rated by other sim racers and build your reputation.
          </p>
          <Link
            href="/profiles/upload"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gradient-start to-gradient-end px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            Upload a Profile
            <Upload className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
    >
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
        Explore <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
