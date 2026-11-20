// World map drawn with SVG. `colors` maps ISO2 codes to colours; tap a country with onPick.
import { geoEqualEarth, geoPath } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import { useMemo } from "react";
import { View } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { codeFromNumeric } from "@/shared/world";
import { useTheme, withAlpha } from "@/theme";

let SHAPES: { d: string; code: string | null }[] | null = null;
function shapes() {
  if (SHAPES) return SHAPES;
  const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  const fc = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
  const path = geoPath(geoEqualEarth().fitSize([960, 470], fc));
  SHAPES = fc.features.filter((f) => f.properties?.name !== "Antarctica").map((f) => ({ d: path(f) ?? "", code: codeFromNumeric(String(f.id ?? "")) }));
  return SHAPES;
}

export function WorldMap({ colors, onPick }: { colors: Record<string, string>; onPick?: (code: string) => void }) {
  const t = useTheme();
  const list = useMemo(shapes, []);
  const empty = withAlpha(t.ink, 0.1);
  return (
    <View style={{ width: "100%", aspectRatio: 960 / 470 }}>
      <Svg width="100%" height="100%" viewBox="0 0 960 470">
        <G>
          {list.map((s, i) => (
            <Path key={i} d={s.d} fill={(s.code && colors[s.code]) || empty} stroke={t.bg} strokeWidth={0.6}
              onPress={onPick && s.code ? () => onPick(s.code!) : undefined} />
          ))}
        </G>
      </Svg>
    </View>
  );
}
