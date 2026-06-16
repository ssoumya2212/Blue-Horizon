import { createFileRoute } from "@tanstack/react-router";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Blue Horizon" },
      { name: "description", content: "Blue Horizon privacy policy." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <article className="container mx-auto max-w-3xl px-4 py-16 prose prose-slate dark:prose-invert">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: 2025</p>
        <p className="mt-6">
          Blue Horizon collects only the data needed to operate safe school
          transport: student name, assigned bus and stop, parent contact
          details, driver credentials and live bus location during active
          routes. We never sell your data.
        </p>
        <h2 className="mt-8 text-xl font-semibold">What we store</h2>
        <p className="mt-2 text-muted-foreground">
          Account details, attendance records and trip history for the durations
          you choose in Settings.
        </p>
        <h2 className="mt-8 text-xl font-semibold">Your rights</h2>
        <p className="mt-2 text-muted-foreground">
          Request export or deletion of your data at any time from your account
          settings.
        </p>
      </article>
      <PublicFooter />
    </div>
  ),
});
