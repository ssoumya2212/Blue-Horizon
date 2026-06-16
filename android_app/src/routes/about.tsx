import { createFileRoute } from "@tanstack/react-router";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { Card } from "@/components/ui/card";
import { Shield, Heart, Target } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Blue Horizon" },
      {
        name: "description",
        content: "About Blue Horizon, our mission and values.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            About us
          </p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            A safer ride, every day
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Blue Horizon was born from a simple idea: parents should never have
            to wonder where the school bus is. We build tools that bring
            clarity, calm and care to the daily commute.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Our mission",
              body: "Make school transport transparent, safe and stress-free.",
            },
            {
              icon: Heart,
              title: "Our values",
              body: "Care, transparency and reliability in every journey.",
            },
            {
              icon: Shield,
              title: "Our promise",
              body: "Every child accounted for, every trip tracked.",
            },
          ].map((c) => (
            <Card key={c.title} className="p-6">
              <c.icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
            </Card>
          ))}
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
