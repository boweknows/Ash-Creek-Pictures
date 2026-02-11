import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/components/forms/project-form";
import { requireUser } from "@/lib/auth";
import { archiveProject } from "./actions";

export default async function SlatePage() {
  const { supabase } = await requireUser();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("archived", false)
    .order("priority", { ascending: true })
    .order("updated_at", { ascending: false });

  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Slate</h1>
        <p className="text-sm text-muted">Keep active projects small and actionable.</p>
        <ProjectForm compact />

        <div className="space-y-3">
          {projects?.map((project) => (
            <Card key={project.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <p className="text-sm text-muted">
                    {project.type} · {project.status} · P{project.priority}
                  </p>
                  <p className="mt-2 text-sm">Next: {project.next_action}</p>
                </div>
                <form action={archiveProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <Button type="submit" variant="ghost">Archive</Button>
                </form>
              </div>
              <ProjectForm initial={project} />
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
