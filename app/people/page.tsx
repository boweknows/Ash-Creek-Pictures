import { addDays, formatISO } from "date-fns";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { saveContact } from "./actions";

export default async function PeoplePage() {
  const { supabase } = await requireUser();
  const today = new Date();
  const nextWeek = formatISO(addDays(today, 7), { representation: "date" });

  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("next_followup_at", { ascending: true, nullsFirst: true });

  const suggested =
    contacts?.filter((c) => !c.last_contacted_at || (c.next_followup_at && c.next_followup_at <= nextWeek)) ?? [];

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">People</h1>
        <Card>
          <h2 className="text-lg font-semibold">Suggested pings this week</h2>
          <ul className="mt-2 space-y-2">
            {suggested.slice(0, 6).map((c) => (
              <li key={c.id} className="rounded-lg border border-slate-800 p-2 text-sm">
                {c.name} {c.org ? `· ${c.org}` : ""} {c.next_followup_at ? `(Follow up ${c.next_followup_at})` : "(Never contacted)"}
              </li>
            ))}
            {suggested.length === 0 && <li className="text-sm text-muted">No pings due.</li>}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Add / Edit Contact</h2>
          <form action={saveContact} className="mt-3 grid gap-2">
            <Input name="id" placeholder="Paste contact id to edit (optional)" />
            <Input name="name" placeholder="Name" required />
            <div className="grid grid-cols-2 gap-2">
              <Input name="org" placeholder="Org" />
              <Input name="role" placeholder="Role" />
            </div>
            <Input name="email" placeholder="Email" type="email" />
            <Input name="tags" placeholder="producer, editor" />
            <div className="grid grid-cols-2 gap-2">
              <Input name="last_contacted_at" type="date" />
              <Input name="next_followup_at" type="date" />
            </div>
            <Textarea name="notes" placeholder="Notes" />
            <Button type="submit">Save contact</Button>
          </form>
        </Card>

        <div className="space-y-2">
          {contacts?.map((contact) => (
            <Card key={contact.id}>
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-muted">{contact.role || ""} {contact.org ? `· ${contact.org}` : ""}</p>
              <p className="mt-1 text-xs text-muted">next follow-up: {contact.next_followup_at ?? "n/a"}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
