import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import { categoriaInfo } from "@/lib/categorias";
import type { Agente } from "@/lib/agentes.functions";

const CENTRO: [number, number] = [-23.96, -46.34];

function pinIcon(agente: Agente, ativo: boolean) {
  const cor = `var(${categoriaInfo(agente.categoria).cssVar})`;
  const avatar = agente.avatar_url ?? "";
  return L.divIcon({
    className: "arthere-pin",
    iconSize: [52, 62],
    iconAnchor: [26, 62],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transform:${ativo ? "scale(1.18)" : "scale(1)"};transition:transform .25s cubic-bezier(.4,0,.2,1)">
        <div style="position:relative;width:44px;height:44px;border-radius:9999px;border:2.5px solid ${cor};overflow:hidden;background:var(--card);box-shadow:0 6px 16px -6px oklch(0.267 0.014 320 / .55)">
          <img src="${avatar}" alt="" style="width:100%;height:100%;object-fit:cover" />
        </div>
        <div style="position:absolute;top:0;right:0;width:11px;height:11px;border-radius:9999px;border:2px solid var(--card);background:${agente.disponivel ? cor : "var(--muted-foreground)"}"></div>
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

function FocarSelecionado({ agente }: { agente: Agente | null }) {
  const map = useMap();
  const ultimoId = useRef<string | null>(null);

  useEffect(() => {
    if (!agente || agente.latitude == null || agente.longitude == null) return;
    if (ultimoId.current === agente.id) return;
    ultimoId.current = agente.id;
    map.flyTo([agente.latitude, agente.longitude], Math.max(map.getZoom(), 13), {
      duration: 0.8,
    });
  }, [agente, map]);

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
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <AjustarLimites agentes={comCoordenadas} />
      <FocarSelecionado agente={selecionado} />
      {comCoordenadas.map((agente) => (
        <Marker
          key={agente.id}
          position={[agente.latitude as number, agente.longitude as number]}
          icon={pinIcon(agente, selecionado?.id === agente.id)}
          zIndexOffset={selecionado?.id === agente.id ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(agente) }}
        />
      ))}
    </MapContainer>
  );
}
