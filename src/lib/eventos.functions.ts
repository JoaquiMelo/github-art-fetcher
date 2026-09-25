import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

export type Evento = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  local_nome: string;
  cidade: string;
  endereco: string | null;
  inicio: string;
  fim: string | null;
  gratuito: boolean;
  preco_centavos: number | null;
};

export const listarEventos = createServerFn({ method: "GET" }).handler(
  async (): Promise<Evento[]> => {
    const supabase = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { data, error } = await supabase
      .from("eventos")
      .select(
        "id, titulo, descricao, categoria, local_nome, cidade, endereco, inicio, fim, gratuito, preco_centavos",
      )
      .eq("publicado", true)
      .order("inicio", { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },
);