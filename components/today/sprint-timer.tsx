"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { addSprint } from "@/app/today/actions";
import { Textarea } from "@/components/ui/textarea";

export function SprintTimer() {
  const [duration, setDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(duration * 60);
  const [running, setRunning] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (secondsLeft === 0) setRunning(false);
  }, [secondsLeft]);

  const label = useMemo(() => {
    const min = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const sec = String(secondsLeft % 60).padStart(2, "0");
    return `${min}:${sec}`;
  }, [secondsLeft]);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-700 bg-panel p-4">
      <h2 className="text-lg font-semibold">Sprint Timer</h2>
      <div className="flex gap-2">
        {[25, 50].map((d) => (
          <Button
            key={d}
            type="button"
            variant={duration === d ? "primary" : "secondary"}
            onClick={() => {
              setDuration(d);
              setSecondsLeft(d * 60);
              setRunning(false);
            }}
          >
            {d} min
          </Button>
        ))}
      </div>
      <p className="text-5xl font-bold tracking-tight">{label}</p>
      <div className="flex gap-2">
        <Button type="button" onClick={() => setRunning((s) => !s)}>
          {running ? "Stop" : "Start"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setRunning(false);
            setSecondsLeft(duration * 60);
          }}
        >
          Reset
        </Button>
      </div>
      <form action={addSprint} className="space-y-2">
        <input type="hidden" name="duration" value={duration} />
        <Textarea
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Sprint notes"
        />
        <Button type="submit" variant="secondary">Save sprint log</Button>
      </form>
    </div>
  );
}
