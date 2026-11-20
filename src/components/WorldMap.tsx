"use client";
import { useMemo } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import world from "world-atlas/countries-110m.json";
import { codeFromNumeric, nameOf } from "@/lib/world";

/** A world map that colours countries. `colors` maps ISO2 codes to CSS colours; `labels` adds a tooltip suffix. */
export function WorldMap({ colors, labels, onPick, label = "World map" }: { colors: Record<string, string>; labels?: Record<string, string>; onPick?: (code: string) => void; label?: string }) {
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
      <svg viewBox="0 0 960 470" role="img" aria-label={label}>
        {shapes.map((s, i) => {
          const fill = s.code ? colors[s.code] : undefined;
          const extra = s.code && labels?.[s.code] ? ` · ${labels[s.code]}` : "";
          return (
            <path key={i} d={s.d} fill={fill ?? "color-mix(in srgb, var(--ink) 12%, transparent)"} stroke="var(--bg)" strokeWidth={0.5}
              style={{ cursor: onPick && s.code ? "pointer" : "default", transition: "fill .2s" }} onClick={() => s.code && onPick?.(s.code)}>
              <title>{`${s.code ? nameOf(s.code) : s.name}${extra}`}</title>
            </path>
          );
        })}
      </svg>
    </div>
  );
}

export const STATUS_COLORS = { been: "var(--brand-text)", going: "var(--gold)", dream: "color-mix(in srgb, var(--ink) 55%, transparent)" } as const;
export const TONE_COLORS: Record<string, string> = { free: "var(--mint)", easy: "var(--gold)", hard: "var(--sunrise)", none: "var(--muted)" };
