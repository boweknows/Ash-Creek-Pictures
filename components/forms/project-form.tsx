"use client";

import { useState } from "react";
import { saveProject } from "@/app/slate/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Project = {
  id?: string;
  name?: string;
  type?: string;
  status?: string;
  priority?: number;
  next_action?: string;
  due_date?: string | null;
  tags?: string[] | null;
};

export function ProjectForm({ initial, compact = false }: { initial?: Project; compact?: boolean }) {
  const [open, setOpen] = useState(!compact);

  return (
    <div className="rounded-xl border border-slate-800 p-3">
      {compact && (
        <Button type="button" variant="secondary" onClick={() => setOpen((s) => !s)}>
          {open ? "Close" : "+ New Project"}
        </Button>
      )}

      {open && (
        <form action={saveProject} className="mt-3 grid gap-2">
          <input type="hidden" name="id" value={initial?.id || ""} />
          <Input name="name" defaultValue={initial?.name} placeholder="Project name" required />
          <div className="grid grid-cols-2 gap-2">
            <Select name="type" defaultValue={initial?.type || "doc"}>
              <option value="doc">Doc</option>
              <option value="narrative">Narrative</option>
              <option value="career">Career</option>
              <option value="admin">Admin</option>
            </Select>
            <Select name="status" defaultValue={initial?.status || "active"}>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="done">Done</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input name="priority" type="number" min={1} max={3} defaultValue={initial?.priority || 2} />
            <Input name="due_date" type="date" defaultValue={initial?.due_date ?? ""} />
          </div>
          <Input name="next_action" defaultValue={initial?.next_action} placeholder="Single next action" required />
          <Input name="tags" defaultValue={initial?.tags?.join(", ")} placeholder="tags, comma, separated" />
          <Button type="submit">Save Project</Button>
        </form>
      )}
    </div>
  );
}
