import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { saveSubmission } from "./actions";

export default async function SubmissionsPage() {
  const { supabase } = await requireUser();
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .order("deadline", { ascending: true, nullsLast: true });

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Submissions</h1>
        <Card>
          <h2 className="text-lg font-semibold">Add festival submission</h2>
          <form action={saveSubmission} className="mt-3 grid gap-2">
            <Input name="film_title" defaultValue="Alpha Station" required />
            <Input name="festival_name" placeholder="Festival name" required />
            <div className="grid grid-cols-2 gap-2">
              <Input name="deadline" type="date" />
              <Select name="status" defaultValue="planned">
                <option value="planned">Planned</option>
                <option value="submitted">Submitted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input name="submission_fee" type="number" step="0.01" placeholder="Fee" />
              <Input name="submission_date" type="date" />
            </div>
            <Input name="filmfreeway_link" placeholder="FilmFreeway link" />
            <Textarea name="notes" placeholder="Notes" />
            <Button type="submit">Add submission</Button>
          </form>
        </Card>

        <div className="space-y-2">
          {submissions?.map((sub) => (
            <Card key={sub.id}>
              <p className="font-medium">{sub.festival_name}</p>
              <p className="text-sm text-muted">{sub.film_title} · {sub.status}</p>
              <p className="text-xs text-muted">Deadline: {sub.deadline ?? "n/a"} · Fee: {sub.submission_fee ?? "n/a"}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
