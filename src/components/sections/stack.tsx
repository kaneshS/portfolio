"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { resume } from "@/data/profile";
import { Section, SectionHead } from "@/components/ui/section";

/*
  The stack as a working shell. Every group in resume.json is a directory:
  `ls` lists them, `cd backend` enters one, `ls` again lists its skills.
  Directory names in output are clickable so it works on a phone too.
*/
const groups = Object.entries(resume.skills) as [string, string[]][];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const findDir = (q: string) => {
  const k = slug(q.replace(/^\.\.\//, "").replace(/\/$/, ""));
  return groups.find(([n]) => slug(n) === k) ?? groups.find(([n]) => slug(n).startsWith(k));
};

type Out = string | { dir: string };
type Line = { cmd: string; cwd: string | null; out: Out[] };

const HELP = [
  "ls            list directories, or skills inside one",
  "cd <dir>      enter a directory   (cd .. to go back)",
  "tree          show everything from here",
  "pwd           where am I",
  "clear         clear the screen",
  "tab           completes directory names",
];

function exec(raw: string, cwd: string | null): { out: Out[]; cwd: string | null; clear?: boolean } {
  const [cmd = "", ...rest] = raw.trim().split(/\s+/);
  const arg = rest.join(" ");
  const items = cwd ? groups.find(([n]) => n === cwd)?.[1] ?? [] : [];

  switch (cmd) {
    case "":
      return { out: [], cwd };
    case "ls":
    case "ll":
    case "dir":
      return { out: cwd ? items : groups.map(([n]) => ({ dir: n })), cwd };
    case "cd": {
      if (!arg || arg === "~" || arg === "/" || arg === ".." || arg === "../") return { out: [], cwd: null };
      const d = findDir(arg);
      return d ? { out: [], cwd: d[0] } : { out: [`cd: no such directory: ${arg}`], cwd };
    }
    case "pwd":
      return { out: [cwd ? `~/stack/${slug(cwd)}` : "~/stack"], cwd };
    case "tree": {
      const src = cwd ? groups.filter(([n]) => n === cwd) : groups;
      const out: Out[] = [];
      src.forEach(([n, v]) => {
        out.push({ dir: n });
        v.forEach((s, i) => out.push(`${i === v.length - 1 ? "└── " : "├── "}${s}`));
      });
      return { out, cwd };
    }
    case "cat":
    case "open":
      return { out: [items.find((s) => slug(s) === slug(arg)) ?? `${cmd}: ${arg || "<file>"}: use ls`], cwd };
    case "help":
    case "?":
      return { out: HELP, cwd };
    case "clear":
      return { out: [], cwd, clear: true };
    default:
      return { out: [`${cmd}: command not found. try: help`], cwd };
  }
}

export function Stack() {
  const [cwd, setCwd] = useState<string | null>(null);
  const [history, setHistory] = useState<Line[]>([{ cmd: "ls", cwd: null, out: groups.map(([n]) => ({ dir: n })) }]);
  const [input, setInput] = useState("");
  const pastRef = useRef<string[]>([]);
  const idxRef = useRef(-1);
  const cwdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const run = (raw: string) => {
    const r = exec(raw, cwdRef.current);
    const line: Line = { cmd: raw, cwd: cwdRef.current, out: r.out };
    cwdRef.current = r.cwd;
    setCwd(r.cwd);
    setHistory((h) => (r.clear ? [] : [...h, line]));
    if (raw.trim()) pastRef.current.push(raw.trim());
    idxRef.current = pastRef.current.length;
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const m = input.match(/^(cd|cat|open)\s+(.*)$/);
      if (!m) return;
      const pool = m[1] === "cd" ? groups.map(([n]) => slug(n)) : (groups.find(([n]) => n === cwd)?.[1] ?? []).map(slug);
      const hit = pool.find((p) => p.startsWith(slug(m[2])));
      if (hit) setInput(`${m[1]} ${hit}`);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const past = pastRef.current;
      idxRef.current = Math.max(0, Math.min(past.length, idxRef.current + (e.key === "ArrowUp" ? -1 : 1)));
      setInput(past[idxRef.current] ?? "");
    }
  };

  const prompt = (c: string | null) => `~/stack${c ? `/${slug(c)}` : ""}`;

  return (
    <Section id="stack">
      <SectionHead num="03" title="Stack" path="~/stack">
        <p className="mt-6 text-fg-dim text-[0.9rem]">
          {groups.length} directories, {groups.reduce((n, [, v]) => n + v.length, 0)} skills. <span className="text-fg-faint">Type a command, or tap a directory.</span>
        </p>
      </SectionHead>

      <div className="term">
        <div className="term-bar">
          <span className="term-lights" aria-hidden="true"><i /><i /><i /></span>
          <span>kanesh@portfolio: {prompt(cwd)}</span>
        </div>
        <div ref={scrollRef} className="p-4 md:p-5 max-h-[26rem] overflow-y-auto text-[0.9rem] cursor-text" onClick={() => inputRef.current?.focus()} style={{ overscrollBehavior: "contain" }}>
          {history.map((l, i) => (
            <div key={i} className="mb-3">
              <p>
                <span className="prompt">$</span> <span className="text-fg-faint">{prompt(l.cwd)}</span> {l.cmd}
              </p>
              {l.out.length > 0 && (
                <ul className={`mt-1 ${l.cmd.trim() === "ls" || l.cmd.trim() === "ll" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6" : ""}`}>
                  {l.out.map((o, j) =>
                    typeof o === "string" ? (
                      <li key={j} className="text-fg-dim whitespace-pre-wrap">{o}</li>
                    ) : (
                      <li key={j}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            run(`cd ${slug(o.dir)}`);
                            run("ls");
                          }}
                          className="t-link text-fg min-h-[32px] text-left"
                        >
                          {o.dir}<span className="text-fg-faint">/</span>
                        </button>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(input);
              setInput("");
            }}
            className="flex items-baseline gap-2"
          >
            <span className="prompt">$</span>
            <span className="text-fg-faint">{prompt(cwd)}</span>
            <label htmlFor="stack-cmd" className="sr-only">Shell command</label>
            <input
              id="stack-cmd"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="ls, cd backend, cd .., tree, help"
              className="flex-1 min-w-0 bg-transparent outline-none text-base md:text-[0.9rem] placeholder:text-fg-faint/70"
            />
          </form>
        </div>
      </div>
    </Section>
  );
}
