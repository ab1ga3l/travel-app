"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Opt = { code: string; name: string; slug: string };

export function VisaPicker({ passports, destinations, dark = false }: { passports: Opt[]; destinations: Opt[]; dark?: boolean }) {
  const router = useRouter();
  const [p, setP] = useState("nigeria");
  const [d, setD] = useState("france");
  return (
    <form
      className="row"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/visa/${p}-to-${d}`);
      }}
    >
      <div>
        <label className="lbl" htmlFor="vp-pass" style={dark ? { color: "inherit", opacity: 0.8 } : undefined}>My passport</label>
        <select id="vp-pass" value={p} onChange={(e) => setP(e.target.value)}>
          {passports.map((x) => (
            <option key={x.code} value={x.slug}>{x.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="lbl" htmlFor="vp-dest" style={dark ? { color: "inherit", opacity: 0.8 } : undefined}>Going to</label>
        <select id="vp-dest" value={d} onChange={(e) => setD(e.target.value)}>
          {destinations.map((x) => (
            <option key={x.code} value={x.slug}>{x.name}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-sun" type="submit" style={{ flex: "0 0 auto" }}>
        Check visa
      </button>
    </form>
  );
}
