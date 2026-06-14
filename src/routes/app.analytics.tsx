import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Leaf, TrendingUp, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "AI Analytics — Blue Horizon" }] }),
  component: AnalyticsDashboard,
});

const ecoData = [
  { name: "Mon", score: 0 },
  { name: "Tue", score: 0 },
  { name: "Wed", score: 0 },
  { name: "Thu", score: 0 },
  { name: "Fri", score: 0 },
];

const otpData = [
  { name: "Route A", onTime: 0, delayed: 0 },
  { name: "Route B", onTime: 0, delayed: 0 },
  { name: "Route C", onTime: 0, delayed: 0 },
  { name: "Route D", onTime: 0, delayed: 0 },
];

function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" /> AI Fleet Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Predictive insights, driver eco-scores, and performance metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5 flex flex-col justify-between shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-muted-foreground">
              Fleet Eco-Score
            </h3>
            <div className="p-2 bg-success/10 text-success rounded-lg">
              <Leaf className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-bold">
            0<span className="text-lg text-muted-foreground">/100</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> 0% from last week
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-between shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-muted-foreground">
              On-Time Performance
            </h3>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-bold">0%</p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Industry avg: 82%
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-between shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-muted-foreground">
              Risk Anomalies
            </h3>
            <div className="p-2 bg-destructive/10 text-destructive rounded-lg">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-bold">0</p>
          <p className="text-xs text-muted-foreground mt-2">
            Harsh braking events detected today
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Eco-Score Trend</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ecoData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">
            On-Time Performance by Route
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={otpData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Bar
                  dataKey="onTime"
                  name="On Time (%)"
                  fill="hsl(var(--success))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="delayed"
                  name="Delayed (%)"
                  fill="hsl(var(--destructive))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
