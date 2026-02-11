import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { requireUser } from "@/lib/auth";
import { getMonday, toDateInput } from "@/lib/utils";
import { assignTaskToWeek, saveWeeklyPlan } from "./actions";

export default async function WeeklyPage() {
  const { supabase } = await requireUser();
  const weekStart = toDateInput(getMonday());

  const [{ data: plan }, { data: tasks }] = await Promise.all([
    supabase.from("weekly_plans").select("*").eq("week_start", weekStart).maybeSingle(),
    supabase.from("tasks").select("id,title,week_start,status").order("created_at", { ascending: false }).limit(10),
  ]);

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Weekly Plan</h1>
        <Card>
          <form action={saveWeeklyPlan} className="space-y-3">
            <input name="week_start" defaultValue={weekStart} type="hidden" />
            <Input name="deliverable" defaultValue={plan?.deliverable ?? ""} placeholder="This Week's Deliverable" required />
            <div className="grid grid-cols-3 gap-2">
              <Input name="ship_target" type="number" defaultValue={plan?.ship_target ?? 1} min={0} />
              <Input name="network_target" type="number" defaultValue={plan?.network_target ?? 2} min={0} />
              <Input name="create_target" type="number" defaultValue={plan?.create_target ?? 3} min={0} />
            </div>
            <Input name="outreach_target_1" defaultValue={plan?.outreach_target_1 ?? ""} placeholder="Outreach target one" />
            <Input name="outreach_target_2" defaultValue={plan?.outreach_target_2 ?? ""} placeholder="Outreach target two" />
            <Button type="submit">Save weekly plan</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Assign tasks to this week</h2>
          <div className="mt-3 space-y-2">
            {tasks?.map((task) => (
              <form key={task.id} action={assignTaskToWeek} className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-slate-800 p-2">
                <div>
                  <p className="text-sm">{task.title}</p>
                  <p className="text-xs text-muted">Status: {task.status}</p>
                </div>
                <input type="hidden" name="id" value={task.id} />
                <Select name="week_start" defaultValue={task.week_start ?? ""}>
                  <option value="">Backlog</option>
                  <option value={weekStart}>This week</option>
                </Select>
                <Button className="col-span-2" type="submit" variant="secondary">Update</Button>
              </form>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
