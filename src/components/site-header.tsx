import { Link } from "@tanstack/react-router";

const NAV = [
  { label: "Mapa", to: "/" as const },
  { label: "Oportunidades", to: "/" as const },
  { label: "Eventos", to: "/eventos" as const },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-extrabold leading-none">Arthere</span>
          <span className="hidden rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-primary sm:inline">
            Baixada Santista
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
               className="rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-muted hover:text-primary sm:inline-flex">
            Entrar
          </button>
          <button className="rounded-full bg-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-background shadow-lift transition-transform hover:-translate-y-0.5">
            Criar perfil
          </button>
        </div>
      </div>
    </header>
  );
}
