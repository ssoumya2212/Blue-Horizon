import { createFileRoute } from "@tanstack/react-router";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Blue Horizon" },
      { name: "description", content: "Blue Horizon terms of use." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <article className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold">Terms of Use</h1>
        <p className="mt-4 text-muted-foreground">
          By using Blue Horizon you agree to use the service for lawful
          school-transport purposes only.
        </p>
        <p className="mt-4 text-muted-foreground">
          Drivers must hold valid licenses and complete admin approval. Parents
          are responsible for keeping contact details current.
        </p>
        <p className="mt-4 text-muted-foreground">
          We provide the service "as is" with reasonable best-effort uptime and
          no warranty of fitness for any specific purpose.
        </p>
      </article>
      <PublicFooter />
    </div>
  ),
});
