import { useEffect, useState } from "react";

export type Report = {
  id: string;
  text: string;
  author: string;
  createdAt: number;
};

const seed: Report[] = [];

let reports: Report[] = [...seed];
const listeners = new Set<(r: Report[]) => void>();

export function getReports() {
  return reports;
}

export function addReport(text: string, author = "You") {
  const r: Report = {
    id: crypto.randomUUID(),
    text,
    author,
    createdAt: Date.now(),
  };
  reports = [r, ...reports];
  listeners.forEach((l) => l(reports));
  return r;
}

export function useReports() {
  const [r, setR] = useState(reports);
  useEffect(() => {
    listeners.add(setR);
    return () => {
      listeners.delete(setR);
    };
  }, []);
  return r;
}

export function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
