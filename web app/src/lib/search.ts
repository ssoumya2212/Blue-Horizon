import { useEffect, useState } from "react";

let query = "";
const listeners = new Set<(q: string) => void>();

export function setSearchQuery(q: string) {
  query = q;
  listeners.forEach((l) => l(q));
}

export function getSearchQuery() {
  return query;
}

export function useSearchQuery() {
  const [q, setQ] = useState(query);
  useEffect(() => {
    listeners.add(setQ);
    return () => {
      listeners.delete(setQ);
    };
  }, []);
  return q;
}
