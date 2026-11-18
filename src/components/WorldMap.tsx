"use client";
import { useMemo } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import world from "world-atlas/countries-110m.json";
import { codeFromNumeric, nameOf } from "@/lib/world";
import type { TripStatus } from "@/lib/store";

const COLORS: Record<TripStatus, string> = { been: "var(--mint)", going: "var(--gold)", dream: "var(--lilac)" };

export function WorldMap({ status, onPick }: { status: Record<string, TripStatus>; onPick?: (code: string) => void }) {
  const shapes = useMemo(() => {
    const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
    const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
    const projection = geoEqualEarth().fitSize([960, 470], fc);
    const path = geoPath(projection);
    return fc.features
      .filter((f) => f.properties?.name !== "Antarctica")
      .map((f) => ({ d: path(f) ?? "", code: codeFromNumeric(String(f.id ?? "")), name: f.properties?.name ?? "" }));
  }, []);

  return (
    <div className="map-wrap">
      <svg viewBox="0 0 960 470" role="img" aria-label="Map of countries you've been to, are going to and dream of">
        {shapes.map((s, i) => {
          const st = s.code ? status[s.code] : undefined;
          return (
            <path
              key={i}
              d={s.d}
              fill={st ? COLORS[st] : "color-mix(in srgb, var(--ink) 12%, transparent)"}
              stroke="var(--bg)"
              strokeWidth={0.5}
              style={{ cursor: onPick && s.code ? "pointer" : "default", transition: "fill .2s" }}
              onClick={() => s.code && onPick?.(s.code)}
            >
              <title>{`${s.code ? nameOf(s.code) : s.name}${st ? ` · ${st}` : ""}`}</title>
            </path>
          );
        })}
      </svg>
    </div>
  );
}
