import { MapPin, MessageCircle, Star, X } from "lucide-react";

import { categoriaInfo } from "@/lib/categorias";
import type { Agente } from "@/lib/agentes.functions";
import { cn } from "@/lib/utils";

export function PainelAgente({ agente, onClose }: { agente: Agente; onClose: () => void }) {
  const cat = categoriaInfo(agente.categoria);

  return (
    <aside className="pointer-events-auto w-full max-w-sm border border-border bg-card shadow-editorial">
      <div className="flex items-start gap-4 p-5">
        {agente.avatar_url ? (
          <img
            src={agente.avatar_url}
            alt={agente.nome}
            className="size-16 shrink-0 rounded-full object-cover"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span className={cn("size-1.5 rounded-full", cat.dot)} />
            {cat.label}
          </span>
          <h3 className="mt-1 truncate font-display text-2xl leading-tight">{agente.nome}</h3>
          <p className="truncate text-sm text-muted-foreground">{agente.especialidade}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-5 border-y border-border px-5 py-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Star className="size-3.5 fill-secondary text-secondary" />
          <span className="font-medium text-foreground">{agente.nota_media.toFixed(1)}</span>(
          {agente.total_avaliacoes})
        </span>
        <span>
          <span className="font-medium text-foreground">{agente.total_projetos}</span> projetos
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5 text-terracotta" />
          {agente.cidade}
        </span>
      </div>

      {agente.bio ? (
        <p className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">{agente.bio}</p>
      ) : null}

      {agente.portfolio.length > 0 ? (
        <div className="grid grid-cols-3 gap-1.5 px-5 pb-4">
          {agente.portfolio.slice(0, 3).map((item) => (
            <img
              key={item.id}
              src={item.imagem_url}
              alt={item.titulo ?? "Trabalho"}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          ))}
        </div>
      ) : null}

      <div className="flex gap-2 border-t border-border p-4">
        <button className="flex-1 bg-foreground px-4 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-background transition-opacity hover:opacity-90">
          Ver perfil
        </button>
        <button className="inline-flex items-center justify-center gap-2 border border-border px-4 py-2.5 text-xs font-medium uppercase tracking-[0.16em] transition-colors hover:bg-muted">
          <MessageCircle className="size-3.5" />
          Conversar
        </button>
      </div>
    </aside>
  );
}
