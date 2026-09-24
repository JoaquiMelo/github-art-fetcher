import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PortfolioItem = {
  id: string;
  imagem_url: string;
  titulo: string | null;
};

export type Agente = {
  id: string;
  nome: string;
  categoria: string;
  especialidade: string;
  bio: string | null;
  cidade: string;
  latitude: number | null;
  longitude: number | null;
  disponivel: boolean;
  avatar_url: string | null;
  nota_media: number;
  total_avaliacoes: number;
  total_projetos: number;
  portfolio: PortfolioItem[];
};

export const listarAgentes = createServerFn({ method: "GET" }).handler(
  async (): Promise<Agente[]> => {
    const supabase = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { data, error } = await supabase
      .from("agentes_criativos")
      .select(
        "id, nome, categoria, especialidade, bio, cidade, latitude, longitude, disponivel, avatar_url, nota_media, total_avaliacoes, total_projetos, portfolio_itens(id, imagem_url, titulo)",
      )
      .eq("visivel_mapa", true)
      .order("nota_media", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((a) => ({
      id: a.id,
      nome: a.nome,
      categoria: a.categoria,
      especialidade: a.especialidade,
      bio: a.bio,
      cidade: a.cidade,
      latitude: a.latitude,
      longitude: a.longitude,
      disponivel: a.disponivel,
      avatar_url: a.avatar_url,
      nota_media: Number(a.nota_media ?? 0),
      total_avaliacoes: a.total_avaliacoes,
      total_projetos: a.total_projetos,
      portfolio: (a.portfolio_itens ?? []).map((p) => ({
        id: p.id,
        imagem_url: p.imagem_url,
        titulo: p.titulo,
      })),
    }));
  },
);
