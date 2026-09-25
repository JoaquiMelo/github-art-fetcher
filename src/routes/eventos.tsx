import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  Ticket,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { listarEventos, type Evento } from "@/lib/eventos.functions";
import { cn } from "@/lib/utils";

const eventosQuery = queryOptions({
  queryKey: ["eventos"],
  queryFn: () => listarEventos(),
});

export const Route = createFileRoute("/eventos")({
  head: () => ({
    meta: [
      { title: "Agenda cultural — Arthere" },
      {
        name: "description",
        content: "Feiras, oficinas, exposições e encontros criativos na Baixada Santista.",
      },
      { property: "og:title", content: "Agenda cultural — Arthere" },
      {
        property: "og:description",
        content: "Descubra os próximos eventos criativos da Baixada Santista.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(eventosQuery),
  component: EventosPage,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar a agenda agora. Atualize a página.
      </p>
    </div>
  ),
});

function EventosPage() {
  const { data: eventos } = useSuspenseQuery(eventosQuery);
  const primeiroEvento = eventos[0];
  const [mes, setMes] = useState(() => startOfMonth(primeiroEvento ? new Date(primeiroEvento.inicio) : new Date()));
  const [selecionado, setSelecionado] = useState<Evento | null>(primeiroEvento ?? null);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const categorias = useMemo(
    () => ["Todos", ...Array.from(new Set(eventos.map((evento) => evento.categoria)))],
    [eventos],
  );

  const eventosFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return eventos.filter((evento) => {
      const naCategoria = categoria === "Todos" || evento.categoria === categoria;
      const noTermo =
        !termo ||
        evento.titulo.toLocaleLowerCase("pt-BR").includes(termo) ||
        evento.local_nome.toLocaleLowerCase("pt-BR").includes(termo) ||
        evento.cidade.toLocaleLowerCase("pt-BR").includes(termo);
      return naCategoria && noTermo;
    });
  }, [eventos, busca, categoria]);

  const eventosDoMes = eventosFiltrados.filter((evento) =>
    isSameMonth(new Date(evento.inicio), mes),
  );
  const diasComEventos = eventosFiltrados.map((evento) => new Date(evento.inicio));

  function escolherDia(data: Date | undefined) {
    if (!data) return;
    const eventoDoDia = eventosFiltrados.find((evento) =>
      isSameDay(new Date(evento.inicio), data),
    );
    if (eventoDoDia) setSelecionado(eventoDoDia);
  }

  function trocarMes(direcao: number) {
    setMes((atual) => addMonths(atual, direcao));
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="mx-auto w-full max-w-6xl px-5 pb-10 pt-14 md:pb-14 md:pt-20">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Agenda cultural · Baixada Santista
              </p>
              <h1 className="mt-5 text-5xl leading-none sm:text-6xl md:text-7xl">
                Encontros que fazem a
                <span className="italic text-primary"> cena acontecer.</span>
              </h1>
            </div>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground md:justify-self-end">
              Feiras, shows, exposições e oficinas para criar, trocar e descobrir o que movimenta a
              região.
            </p>
          </div>
        </section>

        <section className="border-y border-border">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="flex w-full items-center gap-3 lg:max-w-sm">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar evento, local ou cidade"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {busca ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                  className="size-8 shrink-0"
                >
                  <X />
                </Button>
              ) : null}
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {categorias.map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant={categoria === item ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoria(item)}
                  className="shrink-0 rounded-none uppercase tracking-[0.14em]"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:py-14">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Calendário</p>
                <h2 className="mt-1 text-3xl capitalize">{format(mes, "MMMM yyyy", { locale: ptBR })}</h2>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => trocarMes(-1)} aria-label="Mês anterior">
                  <ChevronLeft />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => trocarMes(1)} aria-label="Próximo mês">
                  <ChevronRight />
                </Button>
              </div>
            </div>

            <Calendar
              mode="single"
              month={mes}
              onMonthChange={setMes}
              selected={selecionado ? new Date(selecionado.inicio) : undefined}
              onSelect={escolherDia}
              locale={ptBR}
              hideNavigation
              modifiers={{ comEvento: diasComEventos }}
              modifiersClassNames={{
                comEvento:
                  "after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
              }}
              className="pointer-events-auto mt-5 w-full p-0 [--cell-size:2.65rem] sm:[--cell-size:3.25rem]"
              classNames={{
                root: "w-full",
                month: "w-full gap-5",
                month_caption: "hidden",
                weekdays: "border-b border-border pb-3",
                weekday: "text-[10px] uppercase tracking-[0.14em]",
                week: "mt-3",
                day: "relative",
              }}
            />

            <div className="mt-8 flex items-center gap-5 border-t border-border pt-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" /> Dia com evento
              </span>
              <span>{eventosDoMes.length} na agenda deste mês</span>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between border-b border-border pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Próximos</p>
                <h2 className="mt-1 text-3xl">Agenda do mês</h2>
              </div>
              <span className="text-xs text-muted-foreground">{eventosDoMes.length} eventos</span>
            </div>

            {eventosDoMes.length ? (
              <div className="divide-y divide-border">
                {eventosDoMes.map((evento) => (
                  <button
                    key={evento.id}
                    type="button"
                    onClick={() => setSelecionado(evento)}
                    className={cn(
                      "group grid w-full grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-5 text-left transition-colors",
                      selecionado?.id === evento.id && "text-primary",
                    )}
                  >
                    <span className="border-r border-border pr-4 text-center">
                      <span className="block font-display text-3xl leading-none">
                        {format(new Date(evento.inicio), "dd")}
                      </span>
                      <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {format(new Date(evento.inicio), "EEE", { locale: ptBR })}
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground group-hover:text-primary">
                        {evento.titulo}
                      </span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">
                        {format(new Date(evento.inicio), "HH:mm")} · {evento.local_nome}
                      </span>
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <CalendarDays className="mx-auto size-6 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">Nenhum evento encontrado neste mês.</p>
              </div>
            )}
          </div>
        </section>

        {selecionado ? (
          <section className="bg-foreground text-background">
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 md:grid-cols-[0.8fr_1.2fr] md:py-16">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-background/60">
                  {selecionado.categoria}
                </span>
                <p className="mt-5 font-display text-7xl leading-none text-primary">
                  {format(new Date(selecionado.inicio), "dd")}
                </p>
                <p className="mt-2 text-sm capitalize text-background/70">
                  {format(new Date(selecionado.inicio), "MMMM · EEEE", { locale: ptBR })}
                </p>
              </div>
              <div>
                <h2 className="text-4xl leading-tight sm:text-5xl">{selecionado.titulo}</h2>
                <p className="mt-5 max-w-2xl leading-relaxed text-background/70">
                  {selecionado.descricao}
                </p>
                <div className="mt-8 grid gap-4 border-y border-background/20 py-5 text-sm sm:grid-cols-3">
                  <span className="flex items-center gap-2"><Clock3 className="size-4 text-primary" />{format(new Date(selecionado.inicio), "HH:mm")}</span>
                  <span className="flex items-center gap-2"><MapPin className="size-4 text-primary" />{selecionado.local_nome}</span>
                  <span className="flex items-center gap-2"><Ticket className="size-4 text-primary" />{precoEvento(selecionado)}</span>
                </div>
                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-background/60">
                    {selecionado.endereco ? `${selecionado.endereco} · ` : ""}{selecionado.cidade}
                  </p>
                  <Button
                    onClick={() => toast.success("Interesse registrado. Avisaremos sobre novidades deste evento.")}
                    className="rounded-none"
                  >
                    Tenho interesse <ArrowRight />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function precoEvento(evento: Evento) {
  if (evento.gratuito) return "Gratuito";
  if (evento.preco_centavos === null) return "Consulte";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    evento.preco_centavos / 100,
  );
}