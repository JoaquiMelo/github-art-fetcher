import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import { categoriaInfo } from "@/lib/categorias";
import type { Agente } from "@/lib/agentes.functions";

const CENTRO: [number, number] = [-23.96, -46.34];

function pinIcon(agente: Agente, ativo: boolean) {
  const cor = `var(${categoriaInfo(agente.categoria).cssVar})`;
  const avatar = agente.avatar_url ?? "";
  return L.divIcon({
    className: "arthere-pin",
    iconSize: [48, 58],
    iconAnchor: [24, 58],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transform:${ativo ? "scale(1.12)" : "scale(1)"};transition:transform .2s ease">
        <div style="width:42px;height:42px;border-radius:9999px;border:2.5px solid ${cor};overflow:hidden;background:var(--card);box-shadow:0 6px 16px -6px oklch(0.267 0.014 320 / .55)">
          <img src="${avatar}" alt="" style="width:100%;height:100%;object-fit:cover" />
        </div>
        <div style="width:0;height:0;margin-top:-2px;border-left:6px solid transparent;border-right:6px solid transparent;border-top:10px solid ${cor}"></div>
      </div>
    `,
  });
}

function AjustarLimites({ agentes }: { agentes: Agente[] }) {
  const map = useMap();
  useEffect(() => {
    const pontos = agentes
      .filter((a) => a.latitude != null && a.longitude != null)
      .map((a) => [a.latitude as number, a.longitude as number] as [number, number]);
    if (pontos.length > 1) {
      map.fitBounds(L.latLngBounds(pontos).pad(0.25));
    } else if (pontos[0]) {
      map.setView(pontos[0], 13);
    }
  }, [agentes, map]);
  return null;
}

export default function MapaAgentes({
  agentes,
  selecionado,
  onSelect,
}: {
  agentes: Agente[];
  selecionado: Agente | null;
  onSelect: (a: Agente) => void;
}) {
  const comCoordenadas = useMemo(
    () => agentes.filter((a) => a.latitude != null && a.longitude != null),
    [agentes],
  );

  return (
    <MapContainer
      center={CENTRO}
      zoom={11}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        subdomains={["a", "b", "c", "d"]}
      />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
        subdomains={["a", "b", "c", "d"]}
      />
      <AjustarLimites agentes={comCoordenadas} />
      {comCoordenadas.map((agente) => (
        <Marker
          key={agente.id}
          position={[agente.latitude as number, agente.longitude as number]}
          icon={pinIcon(agente, selecionado?.id === agente.id)}
          eventHandlers={{ click: () => onSelect(agente) }}
        />
      ))}
    </MapContainer>
  );
}
