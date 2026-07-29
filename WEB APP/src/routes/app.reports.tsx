import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { addReport, useReports, timeAgo } from "@/lib/reports";
import { useSearchQuery } from "@/lib/search";

export const Route = createFileRoute("/app/reports")({
  head: () => ({ meta: [{ title: "Reports — Blue Horizon" }] }),
  component: Reports,
});

function Reports() {
  const reports = useReports();
  const [text, setText] = useState("");
  const q = useSearchQuery().toLowerCase();
  const filtered = q
    ? reports.filter(
        (r) =>
          r.text.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q),
      )
    : reports;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addReport(text.trim());
    setText("");
    toast.success("Report submitted");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Submit and review incident reports.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">New report</h2>
          <form className="mt-4 space-y-3" onSubmit={submit}>
            <Textarea
              rows={8}
              placeholder="Enter Report Details…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit" className="w-full sm:w-auto">
              SUBMIT
            </Button>
          </form>
        </Card>
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Recent</h2>
          <ul className="mt-3 space-y-3">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border-l-4 border-primary bg-primary/5 p-3 text-sm"
              >
                <p>{r.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.author} • {timeAgo(r.createdAt)}
                </p>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="text-sm text-muted-foreground">
                No reports match your search.
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
