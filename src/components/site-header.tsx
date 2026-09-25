import { Link } from "@tanstack/react-router";

const NAV = [
  { label: "Mapa", to: "/" as const },
  { label: "Oportunidades", to: "/" as const },
  { label: "Eventos", to: "/eventos" as const },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl leading-none tracking-tight">Arthere</span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground sm:inline">
            Baixada Santista
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary sm:inline-flex">
            Entrar
          </button>
          <button className="rounded-sm bg-foreground px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90">
            Criar perfil
          </button>
        </div>
      </div>
    </header>
  );
}
