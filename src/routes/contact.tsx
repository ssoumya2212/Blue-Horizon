import { createFileRoute } from "@tanstack/react-router";
import { PublicNav } from "@/components/PublicNav";
import { PublicFooter } from "@/components/PublicFooter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Blue Horizon" },
      {
        name: "description",
        content: "Get in touch with the Blue Horizon team.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <section className="container mx-auto grid gap-10 px-4 py-16 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Contact
          </p>
          <h1 className="mt-2 text-4xl font-bold">Let's talk</h1>
          <p className="mt-3 text-muted-foreground">
            We typically reply within one business day.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" /> hello@bluehorizon.school
            </p>
            <p className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" /> +1 (555) 010-2025
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary" /> 12 Cedar Ave,
              Springfield
            </p>
          </div>
        </div>
        <Card className="p-6">
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <Input placeholder="Your name" />
            <Input placeholder="Email" type="email" />
            <Input placeholder="Subject" />
            <Textarea placeholder="How can we help?" rows={5} />
            <Button type="submit" className="w-full">
              Send message
            </Button>
          </form>
        </Card>
      </section>
      <PublicFooter />
    </div>
  );
}
