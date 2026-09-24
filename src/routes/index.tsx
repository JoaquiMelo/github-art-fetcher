import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { lazy, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { AgenteCard } from "@/components/agentes/agente-card";
import { PainelAgente } from "@/components/agentes/painel-agente";
import { listarAgentes, type Agente } from "@/lib/agentes.functions";
import { LISTA_CATEGORIAS } from "@/lib/categorias";
import { cn } from "@/lib/utils";

const MapaAgentes = lazy(() => import("@/components/agentes/mapa-agentes"));

const agentesQuery = queryOptions({
  queryKey: ["agentes"],
  queryFn: () => listarAgentes(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arthere — Talentos criativos da Baixada Santista" },
      {
        name: "description",
        content:
          "Encontre fotógrafos, DJs, videomakers, designers e artesãos perto de você no mapa criativo da Baixada Santista.",
      },
      { property: "og:title", content: "Arthere — Talentos criativos da Baixada Santista" },
      {
        property: "og:description",
        content:
          "Mapa de artistas e profissionais criativos disponíveis para eventos, ensaios e projetos culturais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(agentesQuery),
  component: Home,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar os artistas agora. Atualize a página.
      </p>
    </div>
  ),
  notFoundComponent: () => null,
});

function Home() {
  const { data: agentes } = useSuspenseQuery(agentesQuery);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<Agente | null>(null);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return agentes.filter((a) => {
      const casaCategoria = !categoria || a.categoria === categoria;
      const casaTermo =
        !termo ||
        a.nome.toLowerCase().includes(termo) ||
        a.cidade.toLowerCase().includes(termo) ||
        a.especialidade.toLowerCase().includes(termo);
      return casaCategoria && casaTermo;
    });
  }, [agentes, busca, categoria]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Abertura editorial */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-10 pt-16 md:pt-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Arte, encontro e território
        </p>
        <div className="mt-6 grid gap-10 md:grid-cols-[1.35fr_1fr] md:items-end">
          <h1 className="text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
            O mapa vivo dos
            <br />
            <span className="italic text-primary">talentos criativos</span>
            <br />
            da Baixada Santista.
          </h1>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              Fotógrafos, DJs, videomakers, designers e artesãos abertos a novos projetos. Descubra
              quem está perto, veja o trabalho e comece a conversa.
            </p>
            <div className="flex items-baseline gap-8 border-t border-border pt-5">
              <div>
                <span className="font-display text-4xl">{agentes.length}</span>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  artistas
                </p>
              </div>
              <div>
                <span className="font-display text-4xl">{LISTA_CATEGORIAS.length}</span>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  áreas criativas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Busca e filtros */}
      <section className="mx-auto w-full max-w-6xl px-5">
        <div className="flex flex-col gap-4 border-y border-border py-4 md:flex-row md:items-center md:justify-between">
          <label className="flex w-full items-center gap-3 md:max-w-xs">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar artista ou cidade"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <FiltroChip ativo={!categoria} onClick={() => setCategoria(null)}>
              Todos
            </FiltroChip>
            {LISTA_CATEGORIAS.map((c) => (
              <FiltroChip
                key={c.id}
                ativo={categoria === c.id}
                onClick={() => setCategoria(categoria === c.id ? null : c.id)}
              >
                <span className={cn("size-1.5 rounded-full", c.dot)} />
                {c.label}
              </FiltroChip>
            ))}
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="relative h-[520px] w-full overflow-hidden border border-border bg-muted">
          <ClientOnly
            fallback={
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Carregando o mapa…
              </div>
            }
          >
            <MapaAgentes
              agentes={filtrados}
              selecionado={selecionado}
              onSelect={setSelecionado}
            />
          </ClientOnly>

          <div className="pointer-events-none absolute left-4 top-4 z-[400] bg-background/90 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em]">
            {filtrados.length} {filtrados.length === 1 ? "artista" : "artistas"} no mapa
          </div>

          {selecionado ? (
            <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[400] flex justify-end sm:inset-x-auto sm:right-4">
              <PainelAgente agente={selecionado} onClose={() => setSelecionado(null)} />
            </div>
          ) : null}
        </div>
      </section>

      {/* Vitrine */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="text-3xl md:text-4xl">Em destaque</h2>
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Selecionados pela avaliação
          </span>
        </div>

        {filtrados.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nenhum artista encontrado com esses filtros.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((agente) => (
              <AgenteCard
                key={agente.id}
                agente={agente}
                ativo={selecionado?.id === agente.id}
                onSelect={setSelecionado}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-xl">Arthere</span>
          <p className="text-xs text-muted-foreground">
            Conectando agentes criativos e contratantes na Baixada Santista.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FiltroChip({
  ativo,
  onClick,
  children,
}: {
  ativo?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors",
        ativo
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
