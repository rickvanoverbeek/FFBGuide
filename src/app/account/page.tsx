import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { User, Heart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login");
  }

  const username = user.user_metadata?.username ?? "User";
  const email = user.email ?? "";

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">My Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Welcome back, {username}
        </p>
      </section>

      {/* Profile info */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Account info
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="text-foreground">{email}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Username</dt>
            <dd className="text-foreground">{username}</dd>
          </div>
        </dl>
      </div>

      {/* Dashboard cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              My Profiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You haven&apos;t created any FFB profiles yet. Once you share your
              settings they will appear here.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              My Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Profiles and articles you favorite will be saved here for quick
              access.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
