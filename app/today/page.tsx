import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SprintTimer } from "@/components/today/sprint-timer";
import { requireUser } from "@/lib/auth";
import { saveCheckin, toggleTask } from "./actions";

const moveCards = [
  { title: "Ship", category: "ship" },
  { title: "Network", category: "network" },
  { title: "Create", category: "create" },
] as const;

export default async function TodayPage() {
  const { supabase } = await requireUser();
  const today = new Date().toISOString().split("T")[0];

  const [{ data: tasks }, { data: checkin }] = await Promise.all([
    supabase
      .from("tasks")
      .select("id,title,status,category")
      .eq("due_date", today)
      .in("category", ["ship", "network", "create"])
      .order("created_at", { ascending: true }),
    supabase.from("daily_checkins").select("*").eq("date", today).maybeSingle(),
  ]);

  return (
    <AppShell>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Today</h1>
        <p className="text-sm text-muted">Focus on only three moves.</p>

        <div className="grid gap-3">
          {moveCards.map((move) => {
            const item = tasks?.find((t) => t.category === move.category);
            return (
              <Card key={move.category} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase text-muted">{move.title}</p>
                    <p className="mt-1 text-base font-medium">{item?.title || `No ${move.title.toLowerCase()} move yet`}</p>
                  </div>
                  {item ? (
                    <form action={toggleTask}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={item.status === "done" ? "todo" : "done"}
                      />
                      <input
                        type="checkbox"
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        defaultChecked={item.status === "done"}
                        className="h-6 w-6 rounded border-slate-600 bg-slate-900"
                      />
                    </form>
                  ) : (
                    <span className="text-xs text-muted">Set one in Weekly</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <SprintTimer />
      </section>

      <section className="mt-8">
        <Card>
          <h2 className="text-lg font-semibold">End-of-day check-out</h2>
          <form action={saveCheckin} className="mt-3 space-y-3">
            <label className="block text-sm text-muted">What shipped?</label>
            <Textarea name="shipped_text" defaultValue={checkin?.shipped_text ?? ""} />
            <label className="block text-sm text-muted">What blocked?</label>
            <Textarea name="blocked_text" defaultValue={checkin?.blocked_text ?? ""} />
            <label className="block text-sm text-muted">Tomorrow&apos;s first move?</label>
            <Textarea name="tomorrow_first_move" defaultValue={checkin?.tomorrow_first_move ?? ""} />
            <Button type="submit">Save check-out</Button>
          </form>
        </Card>
      </section>
    </AppShell>
  );
}
