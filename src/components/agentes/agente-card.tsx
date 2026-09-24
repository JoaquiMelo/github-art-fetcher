import { Star, MapPin } from "lucide-react";

import { categoriaInfo } from "@/lib/categorias";
import type { Agente } from "@/lib/agentes.functions";
import { cn } from "@/lib/utils";

export function AgenteCard({
  agente,
  ativo,
  onSelect,
}: {
  agente: Agente;
  ativo?: boolean;
  onSelect?: (a: Agente) => void;
}) {
  const cat = categoriaInfo(agente.categoria);
  const capa = agente.portfolio[0]?.imagem_url;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(agente)}
      className={cn(
        "group flex w-full flex-col overflow-hidden border border-border bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
        ativo && "ring-1 ring-primary",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {capa ? (
          <img
            src={capa}
            alt={`Trabalho de ${agente.nome}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground">
          <span className={cn("size-1.5 rounded-full", cat.dot)} />
          {cat.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl leading-tight">{agente.nome}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{agente.especialidade}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
            <Star className="size-3.5 fill-secondary text-secondary" />
            {agente.nota_media.toFixed(1)}
          </span>
        </div>

        {agente.bio ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{agente.bio}</p>
        ) : null}

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-terracotta" />
            {agente.cidade}
          </span>
          <span
            className={cn(
              "font-medium uppercase tracking-[0.14em]",
              agente.disponivel ? "text-foreground" : "text-muted-foreground/70",
            )}
          >
            {agente.disponivel ? "Disponível" : "Em projeto"}
          </span>
        </div>
      </div>
    </button>
  );
}
